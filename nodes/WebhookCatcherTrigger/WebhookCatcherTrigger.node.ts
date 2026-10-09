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

import { getEndpoints, webhookCatcherApiRequest } from '../WebhookCatcher/GenericFunctions';

// WebhookCatcher adds this header to every forwarded request so n8n can verify the sender.
const SECRET_HEADER = 'X-WebhookCatcher-Secret';

interface TriggerStaticData extends IDataObject {
	forwardingTargetId?: string;
	secret?: string;
}

/**
 * Constant-time comparison so the secret cannot be guessed byte by byte.
 */
function secretsMatch(received: string, expected: string): boolean {
	if (received.length !== expected.length) {
		return false;
	}

	let difference = 0;

	for (let index = 0; index < expected.length; index++) {
		difference |= received.charCodeAt(index) ^ expected.charCodeAt(index);
	}

	return difference === 0;
}

export class WebhookCatcherTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'WebhookCatcher Trigger',
		name: 'webhookCatcherTrigger',
		icon: {
			light: 'file:../WebhookCatcher/webhookCatcher.svg',
			dark: 'file:../WebhookCatcher/webhookCatcher.dark.svg',
		},
		group: ['trigger'],
		version: 1,
		subtitle: '=Endpoint: {{$parameter["endpointId"]}}',
		description:
			'Starts the workflow in real time when a WebhookCatcher endpoint receives a webhook',
		defaults: {
			name: 'WebhookCatcher Trigger',
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
					'WebhookCatcher forwards each accepted webhook to this workflow, so your n8n instance must be reachable from the internet. For n8n on localhost or behind a firewall use the WebhookCatcher Polling Trigger instead.',
				name: 'notice',
				type: 'notice',
				default: '',
			},
			{
				displayName: 'Endpoint Name or ID',
				name: 'endpointId',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getEndpoints' },
				required: true,
				default: '',
				description:
					'Endpoint whose webhooks start the workflow. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Include Headers',
						name: 'includeHeaders',
						type: 'boolean',
						default: true,
						description: 'Whether to output the original request headers next to the body',
					},
					{
						displayName: 'Include Raw Body',
						name: 'includeRawBody',
						type: 'boolean',
						default: false,
						description:
							'Whether to output the body exactly as it was received, as text. Use it for XML or plain text webhooks, or to verify a signature of the original sender.',
					},
				],
			},
		],
	};

	methods = {
		loadOptions: {
			getEndpoints,
		},
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const staticData = this.getWorkflowStaticData('node') as TriggerStaticData;

				if (!staticData.forwardingTargetId) {
					return false;
				}

				try {
					const response = await webhookCatcherApiRequest.call(
						this,
						'GET',
						`forwarding-targets/${staticData.forwardingTargetId}`,
					);
					const target = (response.data as IDataObject) ?? {};

					return (
						target.url === this.getNodeWebhookUrl('default') &&
						target.endpoint_id === this.getNodeParameter('endpointId')
					);
				} catch (error) {
					if ((error as NodeApiError).httpCode === '404') {
						delete staticData.forwardingTargetId;
						delete staticData.secret;

						return false;
					}

					throw new NodeApiError(this.getNode(), error as JsonObject);
				}
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const staticData = this.getWorkflowStaticData('node') as TriggerStaticData;
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const workflow = this.getWorkflow();
				const secret = randomString(48);
				const environment = webhookUrl.includes('/webhook-test/') ? 'test' : 'production';

				const response = await webhookCatcherApiRequest.call(this, 'POST', 'forwarding-targets', {
					endpoint_id: this.getNodeParameter('endpointId') as string,
					// Unique per workflow, node and test/production URL.
					name: `n8n ${environment} · ${workflow.name ?? workflow.id} · ${this.getNode().webhookId ?? this.getNode().id}`.substring(
						0,
						255,
					),
					url: webhookUrl,
					method: 'post',
					auth_type: 'none',
					is_active: true,
					description:
						'Created by the n8n WebhookCatcher Trigger. It is removed when the workflow is deactivated.',
					headers: { [SECRET_HEADER]: secret },
				});

				staticData.forwardingTargetId = (response.data as IDataObject).id as string;
				staticData.secret = secret;

				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const staticData = this.getWorkflowStaticData('node') as TriggerStaticData;

				if (staticData.forwardingTargetId) {
					try {
						await webhookCatcherApiRequest.call(
							this,
							'DELETE',
							`forwarding-targets/${staticData.forwardingTargetId}`,
						);
					} catch (error) {
						if ((error as NodeApiError).httpCode !== '404') {
							return false;
						}
					}
				}

				delete staticData.forwardingTargetId;
				delete staticData.secret;

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const staticData = this.getWorkflowStaticData('node') as TriggerStaticData;
		const headers = this.getHeaderData() as IDataObject;
		const receivedSecret = headers[SECRET_HEADER.toLowerCase()];

		if (
			!staticData.secret ||
			typeof receivedSecret !== 'string' ||
			!secretsMatch(receivedSecret, staticData.secret)
		) {
			this.getResponseObject().status(401).json({ message: 'Invalid WebhookCatcher signature' });

			return { noWebhookResponse: true };
		}

		const options = this.getNodeParameter('options', {}) as IDataObject;
		const forwardedHeaders = Object.fromEntries(
			Object.entries(headers).filter(([name]) => name !== SECRET_HEADER.toLowerCase()),
		);

		const item: IDataObject = {
			body: this.getBodyData(),
			query: this.getQueryData(),
			receivedAt: new Date().toISOString(),
		};

		if (options.includeHeaders !== false) {
			item.headers = forwardedHeaders;
		}

		if (options.includeRawBody === true) {
			// n8n keeps the unparsed bytes on the request; older versions read them on demand.
			const request = this.getRequestObject() as unknown as {
				rawBody?: Buffer;
				readRawBody?: () => Promise<void>;
			};

			if (request.rawBody === undefined && typeof request.readRawBody === 'function') {
				await request.readRawBody();
			}

			item.rawBody = request.rawBody ? request.rawBody.toString('utf8') : '';
		}

		return {
			workflowData: [this.helpers.returnJsonArray(item)],
		};
	}
}
