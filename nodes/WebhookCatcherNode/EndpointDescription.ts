import type { INodeProperties } from 'n8n-workflow';

export const endpointOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['endpoint'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new webhook endpoint catcher',
				action: 'Create an endpoint',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a webhook endpoint catcher',
				action: 'Delete an endpoint',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a specific webhook endpoint catcher',
				action: 'Get an endpoint',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many webhook endpoint catchers',
				action: 'Get many endpoints',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a webhook endpoint catcher',
				action: 'Update an endpoint',
			},
		],
		default: 'getAll',
	},
];

export const endpointFields: INodeProperties[] = [
	// ----------------------------------
	//         endpoint: create
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['endpoint'],
				operation: ['create'],
			},
		},
		description: 'The user-friendly name of the webhook catcher endpoint',
	},
	{
		displayName: 'Path',
		name: 'path',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['endpoint'],
				operation: ['create'],
			},
		},
		description: 'The unique URL path segment for the endpoint',
	},
	{
		displayName: 'Method',
		name: 'method',
		type: 'options',
		required: true,
		default: 'POST',
		displayOptions: {
			show: {
				resource: ['endpoint'],
				operation: ['create'],
			},
		},
		options: [
			{ name: 'DELETE', value: 'DELETE' },
			{ name: 'GET', value: 'GET' },
			{ name: 'PATCH', value: 'PATCH' },
			{ name: 'POST', value: 'POST' },
			{ name: 'PUT', value: 'PUT' },
		],
		description: 'The HTTP method allowed for incoming webhooks',
	},
	{
		displayName: 'Auth Type',
		name: 'auth_type',
		type: 'options',
		required: true,
		default: 'none',
		displayOptions: {
			show: {
				resource: ['endpoint'],
				operation: ['create'],
			},
		},
		options: [
			{ name: 'Basic Auth', value: 'basic' },
			{ name: 'Bearer Token', value: 'bearer' },
			{ name: 'Custom Header', value: 'custom' },
			{ name: 'None', value: 'none' },
		],
		description: 'The authentication type required for incoming webhooks',
	},
	{
		displayName: 'Auth Method ID',
		name: 'auth_method_id',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['endpoint'],
				operation: ['create'],
			},
		},
		description: 'The ID of the associated authentication method profile',
	},
	{
		displayName: 'Is Active',
		name: 'is_active',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: {
				resource: ['endpoint'],
				operation: ['create'],
			},
		},
		description: 'Whether the endpoint is currently active and accepting requests',
	},
	{
		displayName: 'Rate Limit',
		name: 'rate_limit',
		type: 'number',
		default: 60,
		displayOptions: {
			show: {
				resource: ['endpoint'],
				operation: ['create'],
			},
		},
		description: 'The maximum number of requests allowed within the rate limit period',
	},
	{
		displayName: 'Rate Limit Period',
		name: 'rate_limit_period',
		type: 'number',
		default: 60,
		displayOptions: {
			show: {
				resource: ['endpoint'],
				operation: ['create'],
			},
		},
		description: 'The rate limit period in seconds',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['endpoint'],
				operation: ['create'],
			},
		},
		description: 'A brief description of this webhook catcher endpoint',
	},

	// ----------------------------------
	//    endpoint: delete / get
	// ----------------------------------
	{
		displayName: 'Endpoint Name or ID',
		name: 'endpointId',
		type: 'options',
		required: true,
		typeOptions: {
			loadOptionsMethod: 'getEndpoints',
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['endpoint'],
				operation: ['delete', 'get', 'update'],
			},
		},
		description: 'Choose from the list, or specify an ID using an expression. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},

	// ----------------------------------
	//         endpoint: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: {
				resource: ['endpoint'],
				operation: ['getAll'],
			},
		},
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		displayOptions: {
			show: {
				resource: ['endpoint'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},

	// ----------------------------------
	//         endpoint: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['endpoint'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Auth Method ID',
				name: 'auth_method_id',
				type: 'string',
				default: '',
				description: 'The ID of the associated authentication method profile',
			},
			{
				displayName: 'Auth Type',
				name: 'auth_type',
				type: 'options',
				default: 'none',
				options: [
					{ name: 'Basic Auth', value: 'basic' },
					{ name: 'Bearer Token', value: 'bearer' },
					{ name: 'Custom Header', value: 'custom' },
					{ name: 'None', value: 'none' },
				],
				description: 'The authentication type required for incoming webhooks',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'A brief description of this webhook catcher endpoint',
			},
			{
				displayName: 'Is Active',
				name: 'is_active',
				type: 'boolean',
				default: true,
				description: 'Whether the endpoint is currently active and accepting requests',
			},
			{
				displayName: 'Method',
				name: 'method',
				type: 'options',
				default: 'POST',
				options: [
					{ name: 'DELETE', value: 'DELETE' },
					{ name: 'GET', value: 'GET' },
					{ name: 'PATCH', value: 'PATCH' },
					{ name: 'POST', value: 'POST' },
					{ name: 'PUT', value: 'PUT' },
				],
				description: 'The HTTP method allowed for incoming webhooks',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The user-friendly name of the webhook catcher endpoint',
			},
			{
				displayName: 'Path',
				name: 'path',
				type: 'string',
				default: '',
				description: 'The unique URL path segment for the endpoint',
			},
			{
				displayName: 'Rate Limit',
				name: 'rate_limit',
				type: 'number',
				default: 60,
				description: 'The maximum number of requests allowed within the rate limit period',
			},
			{
				displayName: 'Rate Limit Period',
				name: 'rate_limit_period',
				type: 'number',
				default: 60,
				description: 'The rate limit period in seconds',
			},
		],
	},
];
