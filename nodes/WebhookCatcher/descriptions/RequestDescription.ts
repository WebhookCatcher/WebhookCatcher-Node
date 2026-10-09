import type { INodeProperties } from 'n8n-workflow';

import { httpMethodOptions, webhookStatusOptions } from './shared';

const requestIdField: INodeProperties = {
	displayName: 'Request ID',
	name: 'requestId',
	type: 'string',
	required: true,
	default: '',
	description: 'ID of the received webhook request',
};

const requestFilterOptions: INodeProperties[] = [
	{
		displayName: 'Endpoint Name or ID',
		name: 'endpointId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getEndpoints' },
		default: '',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: 'Method',
		name: 'method',
		type: 'options',
		options: httpMethodOptions,
		default: 'post',
	},
	{
		displayName: 'Received After',
		name: 'from',
		type: 'dateTime',
		default: '',
	},
	{
		displayName: 'Received Before',
		name: 'to',
		type: 'dateTime',
		default: '',
	},
	{
		displayName: 'Response Code',
		name: 'responseCode',
		type: 'number',
		default: 200,
		description: 'HTTP status WebhookCatcher answered with (e.g. 401 or 429 for rejected requests)',
	},
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		options: webhookStatusOptions,
		default: 'success',
	},
];

export const requestOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['request'] } },
		options: [
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a webhook request and its forwarding attempts',
				action: 'Delete a request',
			},
			{
				name: 'Delete Many',
				value: 'deleteMany',
				description: 'Delete the webhook requests that match the filters',
				action: 'Delete many requests',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a received webhook request',
				action: 'Get a request',
			},
			{
				name: 'Get Deliveries',
				value: 'getDeliveries',
				description: 'Get the forwarding attempts of a request',
				action: 'Get request deliveries',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many received webhook requests',
				action: 'Get many requests',
			},
			{
				name: 'Redeliver',
				value: 'redeliver',
				description: 'Send a request again to its forwarding targets or to a URL',
				action: 'Redeliver a request',
			},
			{
				name: 'Redeliver Many',
				value: 'redeliverMany',
				description: 'Send the requests that match the filters again to forwarding targets',
				action: 'Redeliver many requests',
			},
		],
		default: 'getAll',
	},
];

export const requestFields: INodeProperties[] = [
	{
		...requestIdField,
		displayOptions: {
			show: {
				resource: ['request'],
				operation: ['delete', 'get', 'getDeliveries', 'redeliver'],
			},
		},
	},

	// redeliver
	{
		displayName: 'Destination',
		name: 'destination',
		type: 'options',
		options: [
			{ name: 'All Active Forwarding Targets', value: 'allTargets' },
			{ name: 'One Forwarding Target', value: 'target' },
			{ name: 'Custom URL', value: 'url' },
		],
		default: 'allTargets',
		displayOptions: { show: { resource: ['request'], operation: ['redeliver'] } },
	},
	{
		displayName: 'Destination',
		name: 'destination',
		type: 'options',
		options: [
			{ name: "All Active Forwarding Targets of Each Request's Endpoint", value: 'allTargets' },
			{ name: 'One Forwarding Target', value: 'target' },
		],
		default: 'allTargets',
		displayOptions: { show: { resource: ['request'], operation: ['redeliverMany'] } },
	},
	{
		displayName: 'Forwarding Target Name or ID',
		name: 'forwardingTargetId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getForwardingTargets' },
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['request'],
				operation: ['redeliver', 'redeliverMany'],
				destination: ['target'],
			},
		},
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://example.com/webhooks',
		displayOptions: {
			show: { resource: ['request'], operation: ['redeliver'], destination: ['url'] },
		},
		description: 'Public URL to send the request to. Private and internal addresses are rejected.',
	},

	// getAll / getDeliveries
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['request'], operation: ['getAll', 'getDeliveries'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1 },
		default: 50,
		displayOptions: {
			show: { resource: ['request'], operation: ['getAll', 'getDeliveries'], returnAll: [false] },
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['request'], operation: ['getAll'] } },
		options: [...requestFilterOptions],
	},
	{
		displayName: 'Sort',
		name: 'order',
		type: 'options',
		options: [
			{ name: 'Newest First', value: 'desc' },
			{ name: 'Oldest First', value: 'asc' },
		],
		default: 'desc',
		displayOptions: { show: { resource: ['request'], operation: ['getAll'] } },
	},

	// deleteMany / redeliverMany
	{
		displayName:
			'At least one filter or request ID is required. Each call to WebhookCatcher deletes up to 10,000 requests or redelivers up to 100; the node repeats it until every matching request is processed.',
		name: 'bulkNotice',
		type: 'notice',
		default: '',
		displayOptions: { show: { resource: ['request'], operation: ['deleteMany', 'redeliverMany'] } },
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['request'], operation: ['deleteMany', 'redeliverMany'] } },
		options: [
			...requestFilterOptions,
			{
				displayName: 'Request IDs',
				name: 'ids',
				type: 'string',
				default: '',
				placeholder: '0199c2a4-..., 0199c2a5-...',
				description: 'Comma-separated IDs of the requests to process (up to 1,000)',
			},
		],
	},
];
