import type { INodeProperties } from 'n8n-workflow';

export const requestOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['request'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get details of a specific received request',
				action: 'Get a request',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many received requests for an endpoint',
				action: 'Get many requests',
			},
			{
				name: 'Redeliver',
				value: 'redeliver',
				description: 'Replay / redeliver a specific request',
				action: 'Redeliver a request',
			},
		],
		default: 'getAll',
	},
];

export const requestFields: INodeProperties[] = [
	// ----------------------------------
	//         request: get / redeliver
	// ----------------------------------
	{
		displayName: 'Request ID',
		name: 'requestId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['request'],
				operation: ['get', 'redeliver'],
			},
		},
		description: 'The unique ID of the request',
	},

	// ----------------------------------
	//         request: getAll
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
				resource: ['request'],
				operation: ['getAll'],
			},
		},
		description: 'Choose from the list, or specify an ID using an expression. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: {
				resource: ['request'],
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
				resource: ['request'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},
];
