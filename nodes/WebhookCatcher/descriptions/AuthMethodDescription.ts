import type { INodeProperties } from 'n8n-workflow';

import { authMethodTypeOptions } from './shared';

const authMethodIdField: INodeProperties = {
	displayName: 'Auth Method Name or ID',
	name: 'authMethodId',
	type: 'options',
	typeOptions: { loadOptionsMethod: 'getAuthMethods' },
	required: true,
	default: '',
	description:
		'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
};

export const authMethodOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['authMethod'] } },
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create an auth method',
				action: 'Create an auth method',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an auth method',
				action: 'Delete an auth method',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an auth method',
				action: 'Get an auth method',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many auth methods',
				action: 'Get many auth methods',
			},
			{
				name: 'Regenerate Credentials',
				value: 'regenerate',
				description: 'Generate a new token or secret (API key, Bearer token and HMAC)',
				action: 'Regenerate auth method credentials',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an auth method',
				action: 'Update an auth method',
			},
		],
		default: 'getAll',
	},
];

export const authMethodFields: INodeProperties[] = [
	// create
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['authMethod'], operation: ['create'] } },
	},
	{
		displayName: 'Type',
		name: 'authType',
		type: 'options',
		options: authMethodTypeOptions,
		default: 'bearer_token',
		displayOptions: { show: { resource: ['authMethod'], operation: ['create'] } },
	},
	{
		displayName: 'Token',
		name: 'token',
		type: 'string',
		typeOptions: { password: true },
		default: '',
		displayOptions: {
			show: {
				resource: ['authMethod'],
				operation: ['create'],
				authType: ['api_key', 'bearer_token'],
			},
		},
		description: 'Leave empty to let WebhookCatcher generate a secure one',
	},
	{
		displayName: 'Username',
		name: 'username',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['authMethod'], operation: ['create'], authType: ['basic'] },
		},
	},
	{
		displayName: 'Password',
		name: 'password',
		type: 'string',
		typeOptions: { password: true },
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['authMethod'], operation: ['create'], authType: ['basic'] },
		},
	},
	{
		displayName: 'Secret',
		name: 'clientSecret',
		type: 'string',
		typeOptions: { password: true },
		default: '',
		displayOptions: {
			show: { resource: ['authMethod'], operation: ['create'], authType: ['hmac'] },
		},
		description:
			'Shared secret used to sign requests. Leave empty to let WebhookCatcher generate one.',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['authMethod'], operation: ['create'] } },
		options: [
			{ displayName: 'Description', name: 'description', type: 'string', default: '' },
			{ displayName: 'Expires At', name: 'expiresAt', type: 'dateTime', default: '' },
		],
	},

	// get / delete / update / regenerate
	{
		...authMethodIdField,
		displayOptions: {
			show: { resource: ['authMethod'], operation: ['get', 'delete', 'update', 'regenerate'] },
		},
	},

	// update
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['authMethod'], operation: ['update'] } },
		options: [
			{ displayName: 'Active', name: 'isActive', type: 'boolean', default: true },
			{ displayName: 'Description', name: 'description', type: 'string', default: '' },
			{ displayName: 'Expires At', name: 'expiresAt', type: 'dateTime', default: '' },
			{ displayName: 'Name', name: 'name', type: 'string', default: '' },
			{
				displayName: 'Password',
				name: 'password',
				type: 'string',
				typeOptions: { password: true },
				default: '',
			},
			{
				displayName: 'Secret',
				name: 'clientSecret',
				type: 'string',
				typeOptions: { password: true },
				default: '',
			},
			{
				displayName: 'Token',
				name: 'token',
				type: 'string',
				typeOptions: { password: true },
				default: '',
			},
			{ displayName: 'Username', name: 'username', type: 'string', default: '' },
		],
	},

	// getAll
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['authMethod'], operation: ['getAll'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1 },
		default: 50,
		displayOptions: {
			show: { resource: ['authMethod'], operation: ['getAll'], returnAll: [false] },
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['authMethod'], operation: ['getAll'] } },
		options: [
			{
				displayName: 'Type',
				name: 'authType',
				type: 'options',
				options: authMethodTypeOptions,
				default: 'bearer_token',
			},
		],
	},
];
