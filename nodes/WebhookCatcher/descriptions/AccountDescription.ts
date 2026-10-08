import type { INodeProperties } from 'n8n-workflow';

export const accountOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['account'] } },
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get the team, plan, monthly usage and token permissions',
				action: 'Get account details',
			},
			{
				name: 'Get Analytics',
				value: 'getAnalytics',
				description: 'Get a traffic summary for a date range',
				action: 'Get analytics',
			},
		],
		default: 'get',
	},
];

export const accountFields: INodeProperties[] = [
	{
		displayName: 'From',
		name: 'from',
		type: 'dateTime',
		default: '',
		displayOptions: { show: { resource: ['account'], operation: ['getAnalytics'] } },
		description: 'Start of the range. Defaults to 30 days before "To".',
	},
	{
		displayName: 'To',
		name: 'to',
		type: 'dateTime',
		default: '',
		displayOptions: { show: { resource: ['account'], operation: ['getAnalytics'] } },
		description: 'End of the range. Defaults to today.',
	},
];
