import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class WebhookCatcherApi implements ICredentialType {
	name = 'webhookCatcherApi';

	displayName = 'WebhookCatcher API';

	icon: Icon = { light: 'file:webhookCatcher.svg', dark: 'file:webhookCatcher.dark.svg' };

	documentationUrl = 'https://github.com/WebhookCatcher/WebhookCatcher-Node#credentials';

	properties: INodeProperties[] = [
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			description:
				'Create it in WebhookCatcher under your profile menu → API Tokens. Requires a plan with API access (Pro, Team or Business).',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			required: true,
			default: 'https://webhookcatcher.com/api/v1',
			description: 'Change it only for self-hosted WebhookCatcher instances',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiToken}}',
				Accept: 'application/json',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl.replace(/\\/$/, "")}}',
			url: '/account',
		},
	};
}
