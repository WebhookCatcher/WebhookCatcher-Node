import type { INodePropertyOptions } from 'n8n-workflow';

// Values match WebhookCatcher's HttpMethodEnum (the API also accepts them in upper case).
export const httpMethodOptions: INodePropertyOptions[] = [
	{ name: 'DELETE', value: 'delete' },
	{ name: 'GET', value: 'get' },
	{ name: 'PATCH', value: 'patch' },
	{ name: 'POST', value: 'post' },
	{ name: 'PUT', value: 'put' },
];

// Authentication types WebhookCatcher can enforce on incoming webhooks.
export const authTypeOptions: INodePropertyOptions[] = [
	{
		name: 'API Key',
		value: 'api_key',
		description: 'Requests must send the key in the X-API-KEY header',
	},
	{ name: 'Basic Auth', value: 'basic', description: 'Requests must send a username and password' },
	{
		name: 'Bearer Token',
		value: 'bearer_token',
		description: 'Requests must send Authorization: Bearer &lt;token&gt;',
	},
	{
		name: 'HMAC',
		value: 'hmac',
		description: 'Requests must be signed with X-Signature and X-Timestamp',
	},
	{ name: 'None', value: 'none', description: 'Accept any request' },
];

export const authMethodTypeOptions: INodePropertyOptions[] = authTypeOptions.filter(
	(option) => option.value !== 'none',
);

export const webhookStatusOptions: INodePropertyOptions[] = [
	{ name: 'Error', value: 'error' },
	{ name: 'Pending', value: 'pending' },
	{ name: 'Success', value: 'success' },
	{ name: 'Timeout', value: 'timeout' },
];

export const filterOperatorOptions: INodePropertyOptions[] = [
	{ name: 'Contains', value: 'contains' },
	{ name: 'Ends With', value: 'ends_with' },
	{ name: 'Equals', value: 'equals' },
	{ name: 'Exists', value: 'exists' },
	{ name: 'Starts With', value: 'starts_with' },
];

export const endpointIdField = {
	displayName: 'Endpoint Name or ID',
	name: 'endpointId',
	type: 'options' as const,
	typeOptions: { loadOptionsMethod: 'getEndpoints' },
	required: true,
	default: '',
	description:
		'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
};
