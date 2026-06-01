import type { INodeProperties } from 'n8n-workflow';

export const forwardingTargetOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['forwardingTarget'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new forwarding target',
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
				description: 'Get a specific forwarding target',
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
	// ----------------------------------
	//     forwardingTarget: create
	// ----------------------------------
	{
		displayName: 'Endpoint Name or ID',
		name: 'endpoint_id',
		type: 'options',
		required: true,
		typeOptions: {
			loadOptionsMethod: 'getEndpoints',
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['forwardingTarget'],
				operation: ['create'],
			},
		},
		description: 'Choose from the list, or specify an ID using an expression. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['forwardingTarget'],
				operation: ['create'],
			},
		},
		description: 'The user-friendly name of the forwarding target',
	},
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['forwardingTarget'],
				operation: ['create'],
			},
		},
		description: 'The destination URL to forward the webhook payload to',
	},
	{
		displayName: 'Method',
		name: 'method',
		type: 'options',
		required: true,
		default: 'POST',
		displayOptions: {
			show: {
				resource: ['forwardingTarget'],
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
		description: 'The HTTP method used to forward payloads',
	},
	{
		displayName: 'Auth Type',
		name: 'auth_type',
		type: 'options',
		required: true,
		default: 'none',
		displayOptions: {
			show: {
				resource: ['forwardingTarget'],
				operation: ['create'],
			},
		},
		options: [
			{ name: 'Basic Auth', value: 'basic' },
			{ name: 'Bearer Token', value: 'bearer' },
			{ name: 'Custom Header', value: 'custom' },
			{ name: 'None', value: 'none' },
		],
		description: 'The authentication type for the forwarding request',
	},
	{
		displayName: 'Auth Method ID',
		name: 'auth_method_id',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['forwardingTarget'],
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
				resource: ['forwardingTarget'],
				operation: ['create'],
			},
		},
		description: 'Whether the forwarding target is currently active and forwarding requests',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['forwardingTarget'],
				operation: ['create'],
			},
		},
		description: 'A brief description of this forwarding target',
	},

	// ----------------------------------
	//  forwardingTarget: delete / get
	// ----------------------------------
	{
		displayName: 'Forwarding Target ID',
		name: 'forwardingTargetId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['forwardingTarget'],
				operation: ['delete', 'get', 'update'],
			},
		},
		description: 'The unique ID of the forwarding target',
	},

	// ----------------------------------
	//        forwardingTarget: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: {
				resource: ['forwardingTarget'],
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
				resource: ['forwardingTarget'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},

	// ----------------------------------
	//        forwardingTarget: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['forwardingTarget'],
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
				description: 'The authentication type for the forwarding request',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'A brief description of this forwarding target',
			},
			{
				displayName: 'Endpoint Name or ID',
				name: 'endpoint_id',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getEndpoints',
				},
				default: '',
				description: 'Choose from the list, or specify an ID using an expression. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Is Active',
				name: 'is_active',
				type: 'boolean',
				default: true,
				description: 'Whether the forwarding target is currently active and forwarding requests',
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
				description: 'The HTTP method used to forward payloads',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The user-friendly name of the forwarding target',
			},
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				default: '',
				description: 'The destination URL to forward the webhook payload to',
			},
		],
	},
];
