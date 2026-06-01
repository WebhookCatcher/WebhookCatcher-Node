import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { apiRequestAllItems } from '../transport';

// Get all the available endpoints
export async function getEndpoints(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const endpoint = 'endpoints';
	const responseData = await apiRequestAllItems.call(this, 'GET', endpoint, {});

	if (responseData === undefined) {
		throw new NodeOperationError(this.getNode(), 'No data got returned');
	}

	const returnData: INodePropertyOptions[] = [];
	let name: string;
	for (const data of responseData) {
		if (!data.full_path) {
			continue;
		}

		name = data.full_path as string;

		returnData.push({
			name,
			value: data.id as string,
		});
	}

	returnData.sort((a, b) => {
		if (a.name < b.name) {
			return -1;
		}
		if (a.name > b.name) {
			return 1;
		}
		return 0;
	});

	return returnData;
}

// Get all the available authentication methods
export async function getAuthMethods(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const endpoint = 'auth-methods';
	const responseData = await apiRequestAllItems.call(this, 'GET', endpoint, {});

	if (responseData === undefined) {
		throw new NodeOperationError(this.getNode(), 'No data got returned');
	}

	const returnData: INodePropertyOptions[] = [];
	let name: string;
	for (const data of responseData) {
		if (!data.name) {
			continue;
		}

		name = data.name as string;

		returnData.push({
			name,
			value: data.id as string,
		});
	}

	returnData.sort((a, b) => {
		if (a.name < b.name) {
			return -1;
		}
		if (a.name > b.name) {
			return 1;
		}
		return 0;
	});

	return returnData;
}
