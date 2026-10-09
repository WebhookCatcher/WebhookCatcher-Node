import { createHmac, timingSafeEqual } from 'crypto';
import type {
	IDataObject,
	IHookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeConnectionTypes, randomString } from 'n8n-workflow';

import { webhookCatcherApiRequest } from '../WebhookCatcher/GenericFunctions';

// Events older than this are rejected, so a captured request cannot be replayed later.
const MAX_EVENT_AGE_SECONDS = 300;

interface EventTriggerStaticData extends IDataObject {
	subscriptionId?: string;
	secret?: string;
}

/**
 * WebhookCatcher signs each event: hex(HMAC-SHA256(secret, timestamp + raw body)).
 */
function signatureIsValid(
	secret: string,
	timestamp: string,
	body: string,
	signature: string,
): boolean {
	const expected = createHmac('sha256', secret)
		.update(timestamp + body)
		.digest('hex');

	return (
		signature.length === expected.length &&
		timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
	);
}

function sameEvents(subscribed: unknown, selected: string[]): boolean {
	if (!Array.isArray(subscribed) || subscribed.length !== selected.length) {
		return false;
	}

	return selected.every((event) => subscribed.includes(event));
}

export class WebhookCatcherEventTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'WebhookCatcher Event Trigger',
		name: 'webhookCatcherEventTrigger',
		icon: {
			light: 'file:../WebhookCatcher/webhookCatcher.svg',
			dark: 'file:../WebhookCatcher/webhookCatcher.dark.svg',
		},
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["events"].join(", ")}}',
		description:
			'Starts the workflow when WebhookCatcher raises an alert: a failed delivery, a rate limited request, a security event or a usage warning',
		defaults: {
			name: 'WebhookCatcher Event Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'webhookCatcherApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName:
					'WebhookCatcher sends each event to this workflow, so your n8n instance must be reachable from the internet. Use "Send Test Alert" on the Alerts page of WebhookCatcher to try it.',
				name: 'notice',
				type: 'notice',
				default: '',
			},
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				required: true,
				options: [
					{
						name: 'Delivery Failed',
						value: 'webhook_failed',
						description:
							'A webhook could not be delivered to a forwarding target after all its attempts',
					},
					{
						name: 'Monthly Usage Warning',
						value: 'monthly_usage_warning',
						description: 'The team used 80% (and again 100%) of its monthly webhook quota',
					},
					{
						name: 'Rate Limited',
						value: 'rate_limited',
						description: 'An endpoint rejected requests that exceeded its rate limit',
					},
					{
						name: 'Security Event',
						value: 'security_events',
						description:
							'A request was rejected for invalid credentials, an auth method was created, updated, regenerated or deleted, or an endpoint was deleted',
					},
					{
						name: 'Test Alert',
						value: 'test',
						description: 'Sent with "Send Test Alert" on the Alerts page',
					},
				],
				default: ['webhook_failed'],
				description:
					'Events that start the workflow. Rate limited and rejected-credential events are sent at most once every 5 minutes per endpoint.',
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const staticData = this.getWorkflowStaticData('node') as EventTriggerStaticData;

				if (!staticData.subscriptionId) {
					return false;
				}

				try {
					const response = await webhookCatcherApiRequest.call(
						this,
						'GET',
						`event-subscriptions/${staticData.subscriptionId}`,
					);
					const subscription = (response.data as IDataObject) ?? {};

					return (
						subscription.url === this.getNodeWebhookUrl('default') &&
						sameEvents(subscription.events, this.getNodeParameter('events') as string[])
					);
				} catch (error) {
					if ((error as NodeApiError).httpCode === '404') {
						delete staticData.subscriptionId;
						delete staticData.secret;

						return false;
					}

					throw new NodeApiError(this.getNode(), error as JsonObject);
				}
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const staticData = this.getWorkflowStaticData('node') as EventTriggerStaticData;
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const workflow = this.getWorkflow();
				const secret = randomString(48);

				// An outdated subscription of this node (other events) is replaced.
				if (staticData.subscriptionId) {
					try {
						await webhookCatcherApiRequest.call(
							this,
							'DELETE',
							`event-subscriptions/${staticData.subscriptionId}`,
						);
					} catch (error) {
						if ((error as NodeApiError).httpCode !== '404') {
							throw new NodeApiError(this.getNode(), error as JsonObject);
						}
					}
				}

				const response = await webhookCatcherApiRequest.call(this, 'POST', 'event-subscriptions', {
					url: webhookUrl,
					events: this.getNodeParameter('events') as string[],
					secret,
					description: `n8n · ${workflow.name ?? workflow.id}`.substring(0, 255),
				});

				staticData.subscriptionId = (response.data as IDataObject).id as string;
				staticData.secret = secret;

				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const staticData = this.getWorkflowStaticData('node') as EventTriggerStaticData;

				if (staticData.subscriptionId) {
					try {
						await webhookCatcherApiRequest.call(
							this,
							'DELETE',
							`event-subscriptions/${staticData.subscriptionId}`,
						);
					} catch (error) {
						if ((error as NodeApiError).httpCode !== '404') {
							return false;
						}
					}
				}

				delete staticData.subscriptionId;
				delete staticData.secret;

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const staticData = this.getWorkflowStaticData('node') as EventTriggerStaticData;
		const headers = this.getHeaderData() as IDataObject;
		const timestamp = headers['x-webhookcatcher-timestamp'];
		const signature = headers['x-webhookcatcher-signature'];

		// n8n keeps the unparsed bytes on the request; older versions read them on demand.
		const request = this.getRequestObject() as unknown as {
			rawBody?: Buffer;
			readRawBody?: () => Promise<void>;
		};

		if (request.rawBody === undefined && typeof request.readRawBody === 'function') {
			await request.readRawBody();
		}

		const rawBody = request.rawBody ? request.rawBody.toString('utf8') : '';
		const age = Math.abs(Date.now() / 1000 - Number(timestamp));

		if (
			!staticData.secret ||
			typeof timestamp !== 'string' ||
			typeof signature !== 'string' ||
			!(age <= MAX_EVENT_AGE_SECONDS) ||
			!signatureIsValid(staticData.secret, timestamp, rawBody, signature)
		) {
			this.getResponseObject().status(401).json({ message: 'Invalid WebhookCatcher signature' });

			return { noWebhookResponse: true };
		}

		const event = this.getBodyData() as IDataObject;
		const events = this.getNodeParameter('events') as string[];

		// The subscription only receives the selected events; this guards against stale ones.
		if (!events.includes(event.event as string)) {
			return { webhookResponse: { message: 'Event ignored' } };
		}

		return {
			workflowData: [this.helpers.returnJsonArray(event)],
		};
	}
}
