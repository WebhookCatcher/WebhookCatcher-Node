import type { INodeProperties } from 'n8n-workflow';

import {
	authTypeOptions,
	endpointIdField,
	filterOperatorOptions,
	httpMethodOptions,
} from './shared';

const forwardingTargetIdField: INodeProperties = {
	displayName: 'Forwarding Target Name or ID',
	name: 'forwardingTargetId',
	type: 'options',
	typeOptions: { loadOptionsMethod: 'getForwardingTargets' },
	required: true,
	default: '',
	description:
		'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
};

const optionalFields: INodeProperties[] = [
	{
		displayName: 'Active',
		name: 'isActive',
		type: 'boolean',
		default: true,
		description: 'Whether webhooks are forwarded to this target',
	},
	{
		displayName: 'Automatic Retries',
		name: 'retryEnabled',
		type: 'boolean',
		default: false,
		description:
			'Whether failed deliveries are retried after 15s, 60s and 300s (Team and Business plans)',
	},
	{
		displayName: 'Custom Headers',
		name: 'headers',
		type: 'fixedCollection',
		typeOptions: { multipleValues: true },
		placeholder: 'Add Header',
		default: {},
		description: 'Headers added to every forwarded request',
		options: [
			{
				displayName: 'Header',
				name: 'header',
				values: [
					{ displayName: 'Name', name: 'name', type: 'string', default: '' },
					{ displayName: 'Value', name: 'value', type: 'string', default: '' },
				],
			},
		],
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
	},
	{
		displayName: 'Payload Filters',
		name: 'filters',
		type: 'fixedCollection',
		typeOptions: { multipleValues: true },
		placeholder: 'Add Filter',
		default: {},
		description:
			'Only forward webhooks whose payload matches every filter (Team and Business plans)',
		options: [
			{
				displayName: 'Filter',
				name: 'filter',
				values: [
					{
						displayName: 'Field',
						name: 'field',
						type: 'string',
						default: '',
						placeholder: 'data.object.status',
						description: 'Dot-notation path in the payload',
					},
					{
						displayName: 'Operator',
						name: 'operator',
						type: 'options',
						options: filterOperatorOptions,
						default: 'equals',
					},
					{ displayName: 'Value', name: 'value', type: 'string', default: '' },
				],
			},
		],
	},
];

export const forwardingTargetOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['forwardingTarget'] } },
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a forwarding target',
				action: 'Create a forwarding target',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a forwarding target',
				action: 'Delete a forwarding target',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a forwarding target',
				action: 'Get a forwarding target',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many forwarding targets',
				action: 'Get many forwarding targets',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a forwarding target',
				action: 'Update a forwarding target',
			},
		],
		default: 'getAll',
	},
];

export const forwardingTargetFields: INodeProperties[] = [
	// create
	{
		...endpointIdField,
		displayOptions: { show: { resource: ['forwardingTarget'], operation: ['create'] } },
		description:
			'Endpoint whose webhooks are forwarded. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['forwardingTarget'], operation: ['create'] } },
	},
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://example.com/webhooks',
		displayOptions: { show: { resource: ['forwardingTarget'], operation: ['create'] } },
		description: 'Public URL that receives the forwarded webhooks',
	},
	{
		displayName: 'Method',
		name: 'method',
		type: 'options',
		options: httpMethodOptions,
		default: 'post',
		displayOptions: { show: { resource: ['forwardingTarget'], operation: ['create'] } },
	},
	{
		displayName: 'Authentication',
		name: 'authType',
		type: 'options',
		options: authTypeOptions,
		default: 'none',
		displayOptions: { show: { resource: ['forwardingTarget'], operation: ['create'] } },
		description: 'Credentials WebhookCatcher sends to the target',
	},
	{
		displayName: 'Auth Method Name or ID',
		name: 'authMethodId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getAuthMethods', loadOptionsDependsOn: ['authType'] },
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['forwardingTarget'], operation: ['create'] },
			hide: { authType: ['none'] },
		},
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['forwardingTarget'], operation: ['create'] } },
		options: optionalFields,
	},

	// get / delete / update
	{
		...forwardingTargetIdField,
		displayOptions: {
			show: { resource: ['forwardingTarget'], operation: ['get', 'delete', 'update'] },
		},
	},

	// update
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['forwardingTarget'], operation: ['update'] } },
		options: [
			{
				displayName: 'Auth Method ID',
				name: 'authMethodId',
				type: 'string',
				default: '',
				description: 'Required when changing Authentication to anything other than None',
			},
			{
				displayName: 'Authentication',
				name: 'authType',
				type: 'options',
				options: authTypeOptions,
				default: 'none',
			},
			{
				displayName: 'Method',
				name: 'method',
				type: 'options',
				options: httpMethodOptions,
				default: 'post',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
			},
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				default: '',
			},
			...optionalFields,
		],
	},

	// getAll
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['forwardingTarget'], operation: ['getAll'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1 },
		default: 50,
		displayOptions: {
			show: { resource: ['forwardingTarget'], operation: ['getAll'], returnAll: [false] },
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['forwardingTarget'], operation: ['getAll'] } },
		options: [
			{
				displayName: 'Endpoint Name or ID',
				name: 'endpointId',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getEndpoints' },
				default: '',
				description:
					'Only targets of this endpoint. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
		],
	},
];
