import type { INodeProperties } from 'n8n-workflow';

import { authTypeOptions, endpointIdField, httpMethodOptions } from './shared';

const commonFields: INodeProperties[] = [
	{
		displayName: 'Active',
		name: 'isActive',
		type: 'boolean',
		default: true,
		description: 'Whether the endpoint accepts webhooks',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
	},
	{
		displayName: 'Rate Limit',
		name: 'rateLimit',
		type: 'number',
		typeOptions: { minValue: 1 },
		default: 60,
		description: 'Maximum number of requests accepted per period',
	},
	{
		displayName: 'Rate Limit Period (Seconds)',
		name: 'rateLimitPeriod',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 86400 },
		default: 60,
	},
];

export const endpointOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['endpoint'] } },
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create an endpoint',
				action: 'Create an endpoint',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an endpoint',
				action: 'Delete an endpoint',
			},
			{ name: 'Get', value: 'get', description: 'Get an endpoint', action: 'Get an endpoint' },
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many endpoints',
				action: 'Get many endpoints',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an endpoint',
				action: 'Update an endpoint',
			},
		],
		default: 'getAll',
	},
];

export const endpointFields: INodeProperties[] = [
	// create
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['endpoint'], operation: ['create'] } },
	},
	{
		displayName: 'Path',
		name: 'path',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'stripe-events',
		displayOptions: { show: { resource: ['endpoint'], operation: ['create'] } },
		description:
			'Lowercase letters, numbers and dashes. Webhooks are sent to https://{team}.webhookcatcher.com/webhook/{path}.',
	},
	{
		displayName: 'Method',
		name: 'method',
		type: 'options',
		options: httpMethodOptions,
		default: 'post',
		displayOptions: { show: { resource: ['endpoint'], operation: ['create'] } },
		description: 'HTTP method accepted by the endpoint',
	},
	{
		displayName: 'Authentication',
		name: 'authType',
		type: 'options',
		options: authTypeOptions,
		default: 'none',
		displayOptions: { show: { resource: ['endpoint'], operation: ['create'] } },
	},
	{
		displayName: 'Auth Method Name or ID',
		name: 'authMethodId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getAuthMethods', loadOptionsDependsOn: ['authType'] },
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['endpoint'], operation: ['create'] },
			hide: { authType: ['none'] },
		},
		description:
			'Credentials incoming webhooks must present. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['endpoint'], operation: ['create'] } },
		options: commonFields,
	},

	// get / delete / update
	{
		...endpointIdField,
		displayOptions: { show: { resource: ['endpoint'], operation: ['get', 'delete', 'update'] } },
	},

	// update
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['endpoint'], operation: ['update'] } },
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
				displayName: 'Path',
				name: 'path',
				type: 'string',
				default: '',
			},
			...commonFields,
		],
	},

	// getAll
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['endpoint'], operation: ['getAll'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1 },
		default: 50,
		displayOptions: { show: { resource: ['endpoint'], operation: ['getAll'], returnAll: [false] } },
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['endpoint'], operation: ['getAll'] } },
		options: [
			{
				displayName: 'Active',
				name: 'isActive',
				type: 'boolean',
				default: true,
				description: 'Whether to return only active (or only inactive) endpoints',
			},
		],
	},
];
