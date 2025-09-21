import { INodeType, INodeTypeDescription, NodeConnectionType, INodeExecutionData, NodeOperationError } from 'n8n-workflow';
import { sendtickFields, sendtickOperations } from './SendtickVerbDescription';

// Use a module-level base URL constant because `this.description` may not be
// populated on the ExecuteContext at runtime in some n8n versions. Reading
// `this.description.requestDefaults` caused a TypeError in runtime.
const BASE_URL = 'https://sendtick.co/api/v1';

export class Sendtick implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Sendtick',
		name: 'sendtick',
		icon: { light: 'file:sendtick.svg', dark: 'file:sendtick.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Sendtick API for WhatsApp messaging',
		defaults: {
			name: 'Sendtick',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'sendtickApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://sendtick.co/api/v1',
			url: '',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		/**
		 * In the properties array we have two mandatory options objects required
		 *
		 * [Resource & Operation]
		 *
		 * https://docs.n8n.io/integrations/creating-nodes/code/create-first-node/#resources-and-operations
		 *
		 * In our example, the operations are separated into their own file (HTTPVerbDescription.ts)
		 * to keep this class easy to read.
		 *
		 */
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Message',
						value: 'message',
					},
					{
						name: 'Contact',
						value: 'contact',
					},
					{
						name: 'Session',
						value: 'session',
					},
				],
				default: 'message',
			},

			...sendtickOperations,
			...sendtickFields,
		],
	};

	async execute(this: any): Promise<any> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const resource = this.getNodeParameter('resource', i) as string;
			const operation = this.getNodeParameter('operation', i) as string;

			try {
				if (resource === 'message' && operation === 'send') {
					const to = this.getNodeParameter('to', i) as string;
					const sessionId = this.getNodeParameter('sessionId', i) as string;
					const message = this.getNodeParameter('message', i) as string;

					// Validate required sessionId
					if (!sessionId) {
						throw new NodeOperationError(this.getNode(), 'sessionId is required for sending messages');
					}

					// Normalize `to` into API expected format: 60123456789@s.whatsapp.net
					let normalizedTo = (to || '').trim();

					// If user provided a full JID (contains '@'), accept it but still trim spaces
					if (!normalizedTo.includes('@')) {
						// Strip leading '+' if present and any non-digit characters except leading '+'
						normalizedTo = normalizedTo.replace(/[^0-9+]/g, '');
						if (normalizedTo.startsWith('+')) {
							normalizedTo = normalizedTo.slice(1);
						}
						// Validate now it's digits only
						if (!/^[0-9]+$/.test(normalizedTo)) {
							throw new NodeOperationError(this.getNode(), 'Invalid `to` phone number. Use digits with optional leading "+" (for example: +60123456789) or a full JID like 60123456789@s.whatsapp.net');
						}
						// Append the WhatsApp domain expected by the Sendtick API
						normalizedTo = `${normalizedTo}@s.whatsapp.net`;
					} else {
						// If user supplied a JID, remove accidental spaces and validate left side contains digits
						normalizedTo = normalizedTo.replace(/\s+/g, '');
						const localPart = normalizedTo.split('@')[0];
						if (!/^[0-9]+$/.test(localPart)) {
							throw new NodeOperationError(this.getNode(), 'Invalid `to` JID local part. Expected digits before the @ (for example: 60123456789@s.whatsapp.net)');
						}
					}

					// Require message
					if (!message) {
						throw new NodeOperationError(this.getNode(), '`message` must be provided');
					}

					const body: { [key: string]: any } = {
						sessionId,
						to: normalizedTo,
					};
					if (message) body.message = message;
					if (message) body.message = message;

					// Use the credential `sendtickApi` (defined in credentials file)
					const response = await this.helpers.requestWithAuthentication.call(this, 'sendtickApi', {
						method: 'POST',
						baseURL: BASE_URL,
						url: '/messages',
						body,
						json: true,
					});

					returnData.push({ json: response as any });
				} else if (resource === 'contact') {
					if (operation === 'create') {
						const phone = this.getNodeParameter('phone', i) as string;
						const name = this.getNodeParameter('name', i) as string;
						const email = this.getNodeParameter('email', i) as string;

						const body: { [key: string]: any } = { phone };
						if (name) body.name = name;
						if (email) body.email = email;

						const response = await this.helpers.requestWithAuthentication.call(this, 'sendtickApi', {
							method: 'POST',
							baseURL: BASE_URL,
							url: '/contacts',
							body,
							json: true,
						});

						returnData.push({ json: response as any });
					} else if (operation === 'get') {
						const contactId = this.getNodeParameter('contactId', i) as string;
						const response = await this.helpers.requestWithAuthentication.call(this, 'sendtickApi', {
							method: 'GET',
							baseURL: BASE_URL,
							url: `/contacts/${contactId}`,
							json: true,
						});

						returnData.push({ json: response as any });
					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						// Common optional query parameters
						const query = this.getNodeParameter('query', i) as string;
						const tag = this.getNodeParameter('tag', i) as string;
						const groupId = this.getNodeParameter('groupId', i) as string;
						const offset = this.getNodeParameter('offset', i) as number;
						const limit = this.getNodeParameter('limit', i) as number;

						const qs: { [key: string]: any } = {};
						if (query) qs.query = query;
						if (tag) qs.tag = tag;
						if (groupId) qs.groupId = groupId;
						if (typeof offset !== 'undefined' && offset !== null) qs.offset = offset;
						if (!returnAll && typeof limit !== 'undefined' && limit !== null) qs.limit = limit;

						const response = await this.helpers.requestWithAuthentication.call(this, 'sendtickApi', {
							method: 'GET',
							baseURL: BASE_URL,
							url: '/contacts',
							qs,
							json: true,
						});
						returnData.push({ json: response as any });
					} else if (operation === 'update') {
						const contactId = this.getNodeParameter('contactId', i) as string;
						const name = this.getNodeParameter('name', i) as string;
						const email = this.getNodeParameter('email', i) as string;

						const body: { [key: string]: any } = {};
						if (name) body.name = name;
						if (email) body.email = email;

						const response = await this.helpers.requestWithAuthentication.call(this, 'sendtickApi', {
							method: 'PUT',
							baseURL: BASE_URL,
							url: `/contacts/${contactId}`,
							body,
							json: true,
						});

						returnData.push({ json: response as any });
					} else if (operation === 'delete') {
						const contactId = this.getNodeParameter('contactId', i) as string;
						const response = await this.helpers.requestWithAuthentication.call(this, 'sendtickApi', {
							method: 'DELETE',
							baseURL: BASE_URL,
							url: `/contacts/${contactId}`,
							json: true,
						});

						returnData.push({ json: response as any });
					}

				} else if (resource === 'session') {
					if (operation === 'getAll') {
						const response = await this.helpers.requestWithAuthentication.call(this, 'sendtickApi', {
							method: 'GET',
							baseURL: BASE_URL,
							url: '/sessions',
							json: true,
						});

						returnData.push({ json: response as any });
					} else if (operation === 'get') {
						const sessionId = this.getNodeParameter('sessionId', i) as string;
						const response = await this.helpers.requestWithAuthentication.call(this, 'sendtickApi', {
							method: 'GET',
							baseURL: BASE_URL,
							url: `/sessions/${sessionId}`,
							json: true,
						});

						returnData.push({ json: response as any });
					}
				} else {
					throw new NodeOperationError(this.getNode(), `Unsupported resource/operation: ${resource}/${operation}`);
				}
			} catch (error) {
				// If the node is configured to continue on fail, return the error object as output.
				if (this.continueOnFail && this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message } });
					continue;
				}

				throw error;
			}
		}

		// n8n expects NodeOutput: an array of output streams, here single output stream
		return this.prepareOutputData(returnData);
	}
}
