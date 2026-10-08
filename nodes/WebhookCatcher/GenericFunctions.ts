import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	INodePropertyOptions,
	IPollFunctions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

type WebhookCatcherContext =
	IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IPollFunctions;

/**
 * Laravel answers validation errors as { message, errors: { field: [messages] } }.
 */
function describeApiError(error: JsonObject): { message?: string; description?: string } {
	const response = (error.response ?? error.cause ?? {}) as JsonObject;
	const body = (response.body ?? response.data ?? error.context ?? {}) as JsonObject;
	const message = typeof body.message === 'string' ? body.message : undefined;
	const errors = body.errors as Record<string, string[]> | undefined;

	if (!errors || typeof errors !== 'object') {
		return { message };
	}

	const details = Object.entries(errors)
		.map(
			([field, messages]) =>
				`${field}: ${(Array.isArray(messages) ? messages : [messages]).join(' ')}`,
		)
		.join('\n');

	return { message, description: details };
}

export async function webhookCatcherApiRequest(
	this: WebhookCatcherContext,
	method: IHttpRequestMethods,
	resource: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<IDataObject> {
	const credentials = await this.getCredentials('webhookCatcherApi');
	const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');

	const options: IHttpRequestOptions = {
		method,
		url: `${baseUrl}/${resource.replace(/^\//, '')}`,
		qs,
		json: true,
	};

	if (Object.keys(body).length > 0) {
		options.body = body;
	}

	try {
		return (await this.helpers.httpRequestWithAuthentication.call(
			this,
			'webhookCatcherApi',
			options,
		)) as IDataObject;
	} catch (error) {
		throw new NodeApiError(
			this.getNode(),
			error as JsonObject,
			describeApiError(error as JsonObject),
		);
	}
}

/**
 * Follow Laravel's paginated responses ({ data, meta: { current_page, last_page } }).
 */
export async function webhookCatcherApiRequestAllItems(
	this: WebhookCatcherContext,
	resource: string,
	qs: IDataObject = {},
	limit?: number,
): Promise<IDataObject[]> {
	const items: IDataObject[] = [];
	let page = 1;
	let lastPage = 1;

	do {
		const response = await webhookCatcherApiRequest.call(
			this,
			'GET',
			resource,
			{},
			{
				...qs,
				page,
				per_page: limit ? Math.min(limit, 100) : 100,
			},
		);

		items.push(...((response.data as IDataObject[]) ?? []));
		lastPage = Number((response.meta as IDataObject | undefined)?.last_page ?? page);
		page++;
	} while (page <= lastPage && (limit === undefined || items.length < limit));

	return limit === undefined ? items : items.slice(0, limit);
}

/**
 * Drop empty values so optional fields are not sent to the API.
 */
export function compactObject(object: IDataObject): IDataObject {
	return Object.fromEntries(
		Object.entries(object).filter(
			([, value]) => value !== undefined && value !== null && value !== '',
		),
	);
}

/**
 * Turn a fixedCollection of { header: [{ name, value }] } into a headers object.
 */
export function headersFromCollection(
	collection: IDataObject | undefined,
): IDataObject | undefined {
	const headers = (collection?.header as IDataObject[] | undefined) ?? [];

	if (headers.length === 0) {
		return undefined;
	}

	return Object.fromEntries(
		headers.map((header) => [header.name as string, header.value as string]),
	);
}

async function loadOptionsFrom(
	this: ILoadOptionsFunctions,
	resource: string,
	label: (item: IDataObject) => string,
	qs: IDataObject = {},
): Promise<INodePropertyOptions[]> {
	const items = await webhookCatcherApiRequestAllItems.call(this, resource, qs);

	return items
		.map((item) => ({ name: label(item), value: item.id as string }))
		.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getEndpoints(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	return await loadOptionsFrom.call(
		this,
		'endpoints',
		(endpoint) => `${endpoint.name} (/${endpoint.path})`,
	);
}

export async function getForwardingTargets(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	return await loadOptionsFrom.call(
		this,
		'forwarding-targets',
		(target) => `${target.name} → ${target.url}`,
	);
}

export async function getAuthMethods(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	let authType: string | undefined;

	try {
		authType = (this.getCurrentNodeParameter('authType') as string | undefined) || undefined;
	} catch {
		authType = undefined;
	}

	return await loadOptionsFrom.call(
		this,
		'auth-methods',
		(method) => `${method.name} (${method.auth_type_name ?? method.auth_type})`,
		authType && authType !== 'none' ? { auth_type: authType } : {},
	);
}
