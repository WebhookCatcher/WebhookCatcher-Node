import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

import { loadOptions } from './methods';
import { apiRequest, apiRequestAllItems } from './transport';
import { endpointOperations, endpointFields } from './EndpointDescription';
import { forwardingTargetOperations, forwardingTargetFields } from './ForwardingTargetDescription';
import { requestOperations, requestFields } from './RequestDescription';
import { authMethodOperations, authMethodFields } from './AuthMethodDescription';

export class WebhookCatcherNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'WebhookCatcher Node',
		name: 'webhookCatcherNode',
		icon: { light: 'file:webhookCatcher.svg', dark: 'file:webhookCatcher.svg' },
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'A custom node to set up forwarding to a WebhookCatcher endpoint.',
		defaults: {
			name: 'WebhookCatcher Node',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'webhookCatcherApi',
				required: true,
			},
		],
		usableAsTool: true,
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Auth Method',
						value: 'authMethod',
					},
					{
						name: 'Endpoint',
						value: 'endpoint',
					},
					{
						name: 'Forwarding Target',
						value: 'forwardingTarget',
					},
					{
						name: 'Request Log',
						value: 'request',
					},
				],
				default: 'endpoint',
			},
			...endpointOperations,
			...endpointFields,
			...forwardingTargetOperations,
			...forwardingTargetFields,
			...requestOperations,
			...requestFields,
			...authMethodOperations,
			...authMethodFields,
		],
	};

	methods = { loadOptions };

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		let responseData: any;

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'endpoint') {
					if (operation === 'create') {
						const body = {
							name: this.getNodeParameter('name', i) as string,
							path: this.getNodeParameter('path', i) as string,
							method: this.getNodeParameter('method', i) as string,
							auth_type: this.getNodeParameter('auth_type', i) as string,
							auth_method_id: this.getNodeParameter('auth_method_id', i, null) as string || null,
							is_active: this.getNodeParameter('is_active', i) as boolean,
							rate_limit: this.getNodeParameter('rate_limit', i) as number,
							rate_limit_period: this.getNodeParameter('rate_limit_period', i) as number,
							description: this.getNodeParameter('description', i, '') as string,
						};
						responseData = await apiRequest.call(this, 'POST', 'endpoints', body);
					} else if (operation === 'delete') {
						const id = this.getNodeParameter('endpointId', i) as string;
						responseData = await apiRequest.call(this, 'DELETE', `endpoints/${id}`);
					} else if (operation === 'get') {
						const id = this.getNodeParameter('endpointId', i) as string;
						responseData = await apiRequest.call(this, 'GET', `endpoints/${id}`);
					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						if (returnAll) {
							responseData = await apiRequestAllItems.call(this, 'GET', 'endpoints', {});
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const response = await apiRequest.call(this, 'GET', 'endpoints', {}, { per_page: limit });
							responseData = response.data.slice(0, limit);
						}
					} else if (operation === 'update') {
						const id = this.getNodeParameter('endpointId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as any;
						const body: any = {};
						for (const key of Object.keys(updateFields)) {
							body[key] = updateFields[key];
						}
						responseData = await apiRequest.call(this, 'PUT', `endpoints/${id}`, body);
					}
				} else if (resource === 'forwardingTarget') {
					if (operation === 'create') {
						const body = {
							endpoint_id: this.getNodeParameter('endpoint_id', i) as string,
							name: this.getNodeParameter('name', i) as string,
							url: this.getNodeParameter('url', i) as string,
							method: this.getNodeParameter('method', i) as string,
							auth_type: this.getNodeParameter('auth_type', i) as string,
							auth_method_id: this.getNodeParameter('auth_method_id', i, null) as string || null,
							is_active: this.getNodeParameter('is_active', i) as boolean,
							description: this.getNodeParameter('description', i, '') as string,
						};
						responseData = await apiRequest.call(this, 'POST', 'forwarding-targets', body);
					} else if (operation === 'delete') {
						const id = this.getNodeParameter('forwardingTargetId', i) as string;
						responseData = await apiRequest.call(this, 'DELETE', `forwarding-targets/${id}`);
					} else if (operation === 'get') {
						const id = this.getNodeParameter('forwardingTargetId', i) as string;
						responseData = await apiRequest.call(this, 'GET', `forwarding-targets/${id}`);
					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						if (returnAll) {
							responseData = await apiRequestAllItems.call(this, 'GET', 'forwarding-targets', {});
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const response = await apiRequest.call(this, 'GET', 'forwarding-targets', {}, { per_page: limit });
							responseData = response.data.slice(0, limit);
						}
					} else if (operation === 'update') {
						const id = this.getNodeParameter('forwardingTargetId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as any;
						const body: any = {};
						for (const key of Object.keys(updateFields)) {
							body[key] = updateFields[key];
						}
						responseData = await apiRequest.call(this, 'PUT', `forwarding-targets/${id}`, body);
					}
				} else if (resource === 'request') {
					if (operation === 'get') {
						const id = this.getNodeParameter('requestId', i) as string;
						responseData = await apiRequest.call(this, 'GET', `requests/${id}`);
					} else if (operation === 'getAll') {
						const endpointId = this.getNodeParameter('endpoint_id', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						if (returnAll) {
							responseData = await apiRequestAllItems.call(this, 'GET', `endpoints/${endpointId}/requests`, {});
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const response = await apiRequest.call(this, 'GET', `endpoints/${endpointId}/requests`, {}, { per_page: limit });
							responseData = response.data.slice(0, limit);
						}
					} else if (operation === 'redeliver') {
						const id = this.getNodeParameter('requestId', i) as string;
						responseData = await apiRequest.call(this, 'POST', `requests/${id}/redeliver`, {});
					}
				} else if (resource === 'authMethod') {
					if (operation === 'create') {
						const type = this.getNodeParameter('type', i) as string;
						const body: any = {
							name: this.getNodeParameter('name', i) as string,
							type,
							description: this.getNodeParameter('description', i, '') as string,
						};
						if (type === 'bearer') {
							body.token = this.getNodeParameter('token', i) as string;
						} else if (type === 'basic') {
							body.username = this.getNodeParameter('username', i) as string;
							body.password = this.getNodeParameter('password', i) as string;
						} else if (type === 'custom') {
							body.header_name = this.getNodeParameter('headerName', i) as string;
							body.header_value = this.getNodeParameter('headerValue', i) as string;
						}
						responseData = await apiRequest.call(this, 'POST', 'auth-methods', body);
					} else if (operation === 'delete') {
						const id = this.getNodeParameter('authMethodId', i) as string;
						responseData = await apiRequest.call(this, 'DELETE', `auth-methods/${id}`);
					} else if (operation === 'get') {
						const id = this.getNodeParameter('authMethodId', i) as string;
						responseData = await apiRequest.call(this, 'GET', `auth-methods/${id}`);
					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						if (returnAll) {
							responseData = await apiRequestAllItems.call(this, 'GET', 'auth-methods', {});
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const response = await apiRequest.call(this, 'GET', 'auth-methods', {}, { per_page: limit });
							responseData = response.data.slice(0, limit);
						}
					} else if (operation === 'update') {
						const id = this.getNodeParameter('authMethodId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as any;
						const body: any = {};
						for (const key of Object.keys(updateFields)) {
							if (key === 'headerName') {
								body.header_name = updateFields[key];
							} else if (key === 'headerValue') {
								body.header_value = updateFields[key];
							} else {
								body[key] = updateFields[key];
							}
						}
						responseData = await apiRequest.call(this, 'PUT', `auth-methods/${id}`, body);
					}
				}

				let dataToReturn = responseData;
				if (responseData && responseData.data) {
					dataToReturn = responseData.data;
				}

				const executionData = this.helpers.returnJsonArray(dataToReturn);
				for (const item of executionData) {
					item.pairedItem = { item: i };
				}
				returnData.push(...executionData);

			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: error.message },
						pairedItem: { item: i },
					});
				} else {
					if (error.context) {
						error.context.itemIndex = i;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex: i,
					});
				}
			}
		}

		return [returnData];
	}
}
