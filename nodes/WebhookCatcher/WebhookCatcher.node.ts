import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

import { accountFields, accountOperations } from './descriptions/AccountDescription';
import { authMethodFields, authMethodOperations } from './descriptions/AuthMethodDescription';
import { endpointFields, endpointOperations } from './descriptions/EndpointDescription';
import {
	forwardingTargetFields,
	forwardingTargetOperations,
} from './descriptions/ForwardingTargetDescription';
import { requestFields, requestOperations } from './descriptions/RequestDescription';
import {
	compactObject,
	getAuthMethods,
	getEndpoints,
	getForwardingTargets,
	headersFromCollection,
	webhookCatcherApiRequest,
	webhookCatcherApiRequestAllItems,
} from './GenericFunctions';

/**
 * Map n8n field names to the API's snake_case fields.
 */
function endpointBody(fields: IDataObject): IDataObject {
	return compactObject({
		name: fields.name,
		path: fields.path,
		method: fields.method,
		auth_type: fields.authType,
		auth_method_id: fields.authType === 'none' ? null : fields.authMethodId,
		is_active: fields.isActive,
		rate_limit: fields.rateLimit,
		rate_limit_period: fields.rateLimitPeriod,
		description: fields.description,
	});
}

function forwardingTargetBody(fields: IDataObject): IDataObject {
	const filters =
		((fields.filters as IDataObject | undefined)?.filter as IDataObject[] | undefined) ?? [];
	const metadata: IDataObject = {};

	if (fields.retryEnabled !== undefined) {
		metadata.retry_enabled = fields.retryEnabled;
	}

	if (filters.length > 0) {
		metadata.filters = filters;
	}

	return compactObject({
		endpoint_id: fields.endpointId,
		name: fields.name,
		url: fields.url,
		method: fields.method,
		auth_type: fields.authType,
		auth_method_id: fields.authType === 'none' ? null : fields.authMethodId,
		is_active: fields.isActive,
		description: fields.description,
		headers: headersFromCollection(fields.headers as IDataObject | undefined),
		metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
	});
}

function authMethodConfig(fields: IDataObject): IDataObject | undefined {
	const config = compactObject({
		token: fields.token,
		username: fields.username,
		password: fields.password,
		client_secret: fields.clientSecret,
	});

	return Object.keys(config).length > 0 ? config : undefined;
}

async function runOperation(
	this: IExecuteFunctions,
	resource: string,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	const unwrap = (response: IDataObject): IDataObject => (response.data as IDataObject) ?? response;

	const list = async (path: string, qs: IDataObject = {}): Promise<IDataObject[]> => {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', i) as number);

		return await webhookCatcherApiRequestAllItems.call(this, path, compactObject(qs), limit);
	};

	if (resource === 'account') {
		if (operation === 'get') {
			return unwrap(await webhookCatcherApiRequest.call(this, 'GET', 'account'));
		}

		if (operation === 'getAnalytics') {
			const toDate = (value: string) => (value ? value.substring(0, 10) : undefined);

			return unwrap(
				await webhookCatcherApiRequest.call(
					this,
					'GET',
					'analytics',
					{},
					compactObject({
						from: toDate(this.getNodeParameter('from', i) as string),
						to: toDate(this.getNodeParameter('to', i) as string),
					}),
				),
			);
		}
	}

	if (resource === 'endpoint') {
		if (operation === 'create') {
			const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

			return unwrap(
				await webhookCatcherApiRequest.call(
					this,
					'POST',
					'endpoints',
					endpointBody({
						isActive: true,
						...additionalFields,
						name: this.getNodeParameter('name', i),
						path: this.getNodeParameter('path', i),
						method: this.getNodeParameter('method', i),
						authType: this.getNodeParameter('authType', i),
						authMethodId: this.getNodeParameter('authMethodId', i, ''),
					}),
				),
			);
		}

		const endpointId =
			operation === 'getAll' ? '' : (this.getNodeParameter('endpointId', i) as string);

		if (operation === 'get') {
			return unwrap(await webhookCatcherApiRequest.call(this, 'GET', `endpoints/${endpointId}`));
		}

		if (operation === 'delete') {
			return await webhookCatcherApiRequest.call(this, 'DELETE', `endpoints/${endpointId}`);
		}

		if (operation === 'update') {
			const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

			if (Object.keys(updateFields).length === 0) {
				throw new NodeOperationError(this.getNode(), 'Add at least one field to update', {
					itemIndex: i,
				});
			}

			return unwrap(
				await webhookCatcherApiRequest.call(
					this,
					'PATCH',
					`endpoints/${endpointId}`,
					endpointBody(updateFields),
				),
			);
		}

		if (operation === 'getAll') {
			const filters = this.getNodeParameter('filters', i) as IDataObject;

			return await list('endpoints', {
				is_active: filters.isActive === undefined ? undefined : Number(filters.isActive),
			});
		}
	}

	if (resource === 'forwardingTarget') {
		if (operation === 'create') {
			const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

			return unwrap(
				await webhookCatcherApiRequest.call(
					this,
					'POST',
					'forwarding-targets',
					forwardingTargetBody({
						isActive: true,
						...additionalFields,
						endpointId: this.getNodeParameter('endpointId', i),
						name: this.getNodeParameter('name', i),
						url: this.getNodeParameter('url', i),
						method: this.getNodeParameter('method', i),
						authType: this.getNodeParameter('authType', i),
						authMethodId: this.getNodeParameter('authMethodId', i, ''),
					}),
				),
			);
		}

		const targetId =
			operation === 'getAll' ? '' : (this.getNodeParameter('forwardingTargetId', i) as string);

		if (operation === 'get') {
			return unwrap(
				await webhookCatcherApiRequest.call(this, 'GET', `forwarding-targets/${targetId}`),
			);
		}

		if (operation === 'delete') {
			return await webhookCatcherApiRequest.call(this, 'DELETE', `forwarding-targets/${targetId}`);
		}

		if (operation === 'update') {
			const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

			if (Object.keys(updateFields).length === 0) {
				throw new NodeOperationError(this.getNode(), 'Add at least one field to update', {
					itemIndex: i,
				});
			}

			return unwrap(
				await webhookCatcherApiRequest.call(
					this,
					'PATCH',
					`forwarding-targets/${targetId}`,
					forwardingTargetBody(updateFields),
				),
			);
		}

		if (operation === 'getAll') {
			const filters = this.getNodeParameter('filters', i) as IDataObject;

			return await list('forwarding-targets', { endpoint_id: filters.endpointId });
		}
	}

	if (resource === 'authMethod') {
		if (operation === 'create') {
			const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
			const authType = this.getNodeParameter('authType', i) as string;

			return unwrap(
				await webhookCatcherApiRequest.call(
					this,
					'POST',
					'auth-methods',
					compactObject({
						name: this.getNodeParameter('name', i),
						type: authType,
						description: additionalFields.description,
						expires_at: additionalFields.expiresAt,
						config: authMethodConfig({
							token: this.getNodeParameter('token', i, ''),
							username: this.getNodeParameter('username', i, ''),
							password: this.getNodeParameter('password', i, ''),
							clientSecret: this.getNodeParameter('clientSecret', i, ''),
						}),
					}),
				),
			);
		}

		const authMethodId =
			operation === 'getAll' ? '' : (this.getNodeParameter('authMethodId', i) as string);

		if (operation === 'get') {
			return unwrap(
				await webhookCatcherApiRequest.call(this, 'GET', `auth-methods/${authMethodId}`),
			);
		}

		if (operation === 'delete') {
			return await webhookCatcherApiRequest.call(this, 'DELETE', `auth-methods/${authMethodId}`);
		}

		if (operation === 'regenerate') {
			return unwrap(
				await webhookCatcherApiRequest.call(
					this,
					'POST',
					`auth-methods/${authMethodId}/regenerate`,
				),
			);
		}

		if (operation === 'update') {
			const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

			if (Object.keys(updateFields).length === 0) {
				throw new NodeOperationError(this.getNode(), 'Add at least one field to update', {
					itemIndex: i,
				});
			}

			return unwrap(
				await webhookCatcherApiRequest.call(
					this,
					'PATCH',
					`auth-methods/${authMethodId}`,
					compactObject({
						name: updateFields.name,
						description: updateFields.description,
						is_active: updateFields.isActive,
						expires_at: updateFields.expiresAt,
						config: authMethodConfig(updateFields),
					}),
				),
			);
		}

		if (operation === 'getAll') {
			const filters = this.getNodeParameter('filters', i) as IDataObject;

			return await list('auth-methods', { auth_type: filters.authType });
		}
	}

	if (resource === 'request') {
		if (operation === 'getAll') {
			const filters = this.getNodeParameter('filters', i) as IDataObject;

			return await list('requests', {
				endpoint_id: filters.endpointId,
				status: filters.status,
				method: filters.method,
				response_code: filters.responseCode,
				from: filters.from,
				to: filters.to,
				order: this.getNodeParameter('order', i),
			});
		}

		const requestId = this.getNodeParameter('requestId', i) as string;

		if (operation === 'get') {
			return unwrap(await webhookCatcherApiRequest.call(this, 'GET', `requests/${requestId}`));
		}

		if (operation === 'getDeliveries') {
			return await list(`requests/${requestId}/deliveries`);
		}

		if (operation === 'redeliver') {
			const destination = this.getNodeParameter('destination', i) as string;
			const body: IDataObject = {};

			if (destination === 'target') {
				body.forwarding_target_id = this.getNodeParameter('forwardingTargetId', i);
			}

			if (destination === 'url') {
				body.url = this.getNodeParameter('url', i);
			}

			return await webhookCatcherApiRequest.call(
				this,
				'POST',
				`requests/${requestId}/redeliver`,
				body,
			);
		}
	}

	throw new NodeOperationError(
		this.getNode(),
		`The operation "${operation}" is not supported for "${resource}"`,
		{
			itemIndex: i,
		},
	);
}

export class WebhookCatcher implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'WebhookCatcher',
		name: 'webhookCatcher',
		icon: { light: 'file:webhookCatcher.svg', dark: 'file:webhookCatcher.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description:
			'Manage WebhookCatcher endpoints, forwarding targets, auth methods and webhook requests',
		defaults: {
			name: 'WebhookCatcher',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'webhookCatcherApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Account', value: 'account' },
					{ name: 'Auth Method', value: 'authMethod' },
					{ name: 'Endpoint', value: 'endpoint' },
					{ name: 'Forwarding Target', value: 'forwardingTarget' },
					{ name: 'Request', value: 'request' },
				],
				default: 'endpoint',
			},
			...accountOperations,
			...accountFields,
			...authMethodOperations,
			...authMethodFields,
			...endpointOperations,
			...endpointFields,
			...forwardingTargetOperations,
			...forwardingTargetFields,
			...requestOperations,
			...requestFields,
		],
	};

	methods = {
		loadOptions: {
			getAuthMethods,
			getEndpoints,
			getForwardingTargets,
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				const response = await runOperation.call(this, resource, operation, i);
				const data = Array.isArray(response) ? response : [response];

				returnData.push(
					...this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(data), {
						itemData: { item: i },
					}),
				);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
					continue;
				}

				if (error instanceof NodeApiError) {
					throw new NodeApiError(this.getNode(), error as unknown as JsonObject, { itemIndex: i });
				}

				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
			}
		}

		return [returnData];
	}
}
