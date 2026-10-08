import type {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IPollFunctions,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

import {
	compactObject,
	getEndpoints,
	webhookCatcherApiRequest,
} from '../WebhookCatcher/GenericFunctions';
import { webhookStatusOptions } from '../WebhookCatcher/descriptions/shared';

// Ids are time-ordered UUIDv7: any real id sorts after this one.
const START_CURSOR = '00000000-0000-0000-0000-000000000000';

// Safety limit so a long downtime does not produce one huge execution.
const MAX_ITEMS_PER_POLL = 500;

interface PollStaticData extends IDataObject {
	lastRequestId?: string;
}

export class WebhookCatcherPollingTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'WebhookCatcher Polling Trigger',
		name: 'webhookCatcherPollingTrigger',
		icon: {
			light: 'file:../WebhookCatcher/webhookCatcher.svg',
			dark: 'file:../WebhookCatcher/webhookCatcher.dark.svg',
		},
		group: ['trigger'],
		version: 1,
		description:
			'Starts the workflow when new webhook requests are stored in WebhookCatcher (works with n8n on localhost)',
		subtitle: '=Every poll: new requests',
		defaults: {
			name: 'WebhookCatcher Polling Trigger',
		},
		polling: true,
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'webhookCatcherApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Endpoint Name or ID',
				name: 'endpointId',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getEndpoints' },
				default: '',
				description:
					'Only requests of this endpoint. Leave empty for all endpoints. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				options: [
					{
						displayName: 'Status',
						name: 'status',
						type: 'options',
						options: webhookStatusOptions,
						default: 'success',
						description:
							'Only requests with this status (e.g. Error to react to rejected webhooks)',
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

	async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
		const staticData = this.getWorkflowStaticData('node') as PollStaticData;
		const filters = this.getNodeParameter('filters', {}) as IDataObject;
		const qs = compactObject({
			endpoint_id: this.getNodeParameter('endpointId', '') as string,
			status: filters.status,
		});

		// Manual test run: show the latest request so the user can map its fields.
		if (this.getMode() === 'manual') {
			const latest = await webhookCatcherApiRequest.call(
				this,
				'GET',
				'requests',
				{},
				{ ...qs, per_page: 1, order: 'desc' },
			);
			const data = (latest.data as IDataObject[]) ?? [];

			return data.length > 0 ? [this.helpers.returnJsonArray(data)] : null;
		}

		// First activation: start from the newest request instead of replaying the history.
		if (!staticData.lastRequestId) {
			const latest = await webhookCatcherApiRequest.call(
				this,
				'GET',
				'requests',
				{},
				{ ...qs, per_page: 1, order: 'desc' },
			);
			const newest = ((latest.data as IDataObject[]) ?? [])[0];

			staticData.lastRequestId = (newest?.id as string | undefined) ?? START_CURSOR;

			return null;
		}

		const newRequests: IDataObject[] = [];
		let page = 1;
		let lastPage = 1;

		do {
			const response = await webhookCatcherApiRequest.call(
				this,
				'GET',
				'requests',
				{},
				{
					...qs,
					after: staticData.lastRequestId,
					order: 'asc',
					per_page: 100,
					page,
				},
			);

			newRequests.push(...((response.data as IDataObject[]) ?? []));
			lastPage = Number((response.meta as IDataObject | undefined)?.last_page ?? page);
			page++;
		} while (page <= lastPage && newRequests.length < MAX_ITEMS_PER_POLL);

		if (newRequests.length === 0) {
			return null;
		}

		const emitted = newRequests.slice(0, MAX_ITEMS_PER_POLL);
		staticData.lastRequestId = emitted[emitted.length - 1].id as string;

		return [this.helpers.returnJsonArray(emitted)];
	}
}
