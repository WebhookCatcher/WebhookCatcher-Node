import type { INodeProperties } from 'n8n-workflow';

export const authMethodOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['authMethod'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new authentication method',
				action: 'Create an authentication method',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an authentication method',
				action: 'Delete an authentication method',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a specific authentication method',
				action: 'Get an authentication method',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many authentication methods',
				action: 'Get many authentication methods',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an authentication method',
				action: 'Update an authentication method',
			},
		],
		default: 'getAll',
	},
];

export const authMethodFields: INodeProperties[] = [
	// ----------------------------------
	//        authMethod: create
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['authMethod'],
				operation: ['create'],
			},
		},
		description: 'The user-friendly name of this authentication profile',
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		required: true,
		default: 'bearer',
		displayOptions: {
			show: {
				resource: ['authMethod'],
				operation: ['create'],
			},
		},
		options: [
			{ name: 'Basic Auth', value: 'basic' },
			{ name: 'Bearer Token', value: 'bearer' },
			{ name: 'Custom Header', value: 'custom' },
		],
		description: 'The type of authentication protocol to use',
	},
	{
		displayName: 'Bearer Token',
		name: 'token',
		type: 'string',
		typeOptions: { password: true },
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['authMethod'],
				operation: ['create'],
				type: ['bearer'],
			},
		},
		description: 'The secret Bearer token',
	},
	{
		displayName: 'Username',
		name: 'username',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['authMethod'],
				operation: ['create'],
				type: ['basic'],
			},
		},
		description: 'The username for Basic authentication',
	},
	{
		displayName: 'Password',
		name: 'password',
		type: 'string',
		typeOptions: { password: true },
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['authMethod'],
				operation: ['create'],
				type: ['basic'],
			},
		},
		description: 'The password for Basic authentication',
	},
	{
		displayName: 'Header Name',
		name: 'headerName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['authMethod'],
				operation: ['create'],
				type: ['custom'],
			},
		},
		description: 'The custom HTTP header name (e.g. X-API-KEY)',
	},
	{
		displayName: 'Header Value',
		name: 'headerValue',
		type: 'string',
		typeOptions: { password: true },
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['authMethod'],
				operation: ['create'],
				type: ['custom'],
			},
		},
		description: 'The value to send in the custom HTTP header',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['authMethod'],
				operation: ['create'],
			},
		},
		description: 'A brief description of this authentication method profile',
	},

	// ----------------------------------
	//     authMethod: delete / get / update
	// ----------------------------------
	{
		displayName: 'Auth Method Name or ID',
		name: 'authMethodId',
		type: 'options',
		required: true,
		typeOptions: {
			loadOptionsMethod: 'getAuthMethods',
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['authMethod'],
				operation: ['delete', 'get', 'update'],
			},
		},
		description: 'Choose from the list, or specify an ID using an expression. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},

	// ----------------------------------
	//        authMethod: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: {
				resource: ['authMethod'],
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
				resource: ['authMethod'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},

	// ----------------------------------
	//        authMethod: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['authMethod'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Bearer Token',
				name: 'token',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				description: 'The secret Bearer token',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'A brief description of this authentication method profile',
			},
			{
				displayName: 'Header Name',
				name: 'headerName',
				type: 'string',
				default: '',
				description: 'The custom HTTP header name (e.g. X-API-KEY)',
			},
			{
				displayName: 'Header Value',
				name: 'headerValue',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				description: 'The value to send in the custom HTTP header',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The user-friendly name of this authentication profile',
			},
			{
				displayName: 'Password',
				name: 'password',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				description: 'The password for Basic authentication',
			},
			{
				displayName: 'Username',
				name: 'username',
				type: 'string',
				default: '',
				description: 'The username for Basic authentication',
			},
		],
	},
];
