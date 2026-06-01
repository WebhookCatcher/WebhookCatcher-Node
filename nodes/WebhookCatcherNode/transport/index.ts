import { NodeOperationError } from 'n8n-workflow';
import type {
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	GenericValue,
	IDataObject,
	IHttpRequestMethods,
	IHttpRequestOptions,
} from 'n8n-workflow';

/**
 * Make an API request to WebhookCatcher
 */
export async function apiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject | GenericValue | GenericValue[] = {},
	query: IDataObject = {},
) {
	const credentials = await this.getCredentials('webhookCatcherApi');
	const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');

	const options: IHttpRequestOptions = {
		method,
		body,
		qs: query,
		url: `${baseUrl}/${endpoint}`,
		headers: {
			accept: 'application/json',
		},
		skipSslCertificateValidation: credentials.allowUnauthorizedCerts as boolean,
	};

	try {
		return await this.helpers.httpRequestWithAuthentication.call(this, 'webhookCatcherApi', options);
	} catch (error) {
		let errorMessage = 'An error occurred while communicating with WebhookCatcher';
		
		// Attempt to extract the cleanest possible error message from the backend response
		if (error.description) {
			errorMessage = error.description;
		} else if (error.context?.data?.message) {
			errorMessage = error.context.data.message;
		} else if (error.response?.data?.message) {
			errorMessage = error.response.data.message;
		} else if (error.message) {
			errorMessage = error.message;
		}

		throw new NodeOperationError(this.getNode(), errorMessage, {
			description: error.description || undefined,
		});
	}
}

export async function apiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD',
	endpoint: string,
	body: IDataObject = {},
	query: IDataObject = {},
) {
	const returnData: IDataObject[] = [];

	let responseData;
	query.page = 1;
	query.per_page = 100;

	do {
		responseData = await apiRequest
			.call(this, method, endpoint, body, query)
			.then((data) => data.data);
		query.page++;
		console.log('Response Data:', responseData);
		returnData.push.apply(returnData, responseData as IDataObject[]);
	} while (responseData.length !== 0);

	return returnData;
}
