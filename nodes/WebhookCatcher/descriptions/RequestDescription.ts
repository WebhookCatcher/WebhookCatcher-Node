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

export const requestOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['request'] } },
		options: [
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
		],
		default: 'getAll',
	},
];

export const requestFields: INodeProperties[] = [
	{
		...requestIdField,
		displayOptions: {
			show: { resource: ['request'], operation: ['get', 'getDeliveries', 'redeliver'] },
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
		displayName: 'Forwarding Target Name or ID',
		name: 'forwardingTargetId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getForwardingTargets' },
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['request'], operation: ['redeliver'], destination: ['target'] },
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
		options: [
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
				description:
					'HTTP status WebhookCatcher answered with (e.g. 401 or 429 for rejected requests)',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: webhookStatusOptions,
				default: 'success',
			},
		],
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
];
