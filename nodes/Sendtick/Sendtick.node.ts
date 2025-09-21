import { INodeType, INodeTypeDescription, NodeConnectionType, INodeExecutionData, NodeOperationError } from 'n8n-workflow';
import { sendtickFields, sendtickOperations } from './SendtickVerbDescription';

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
			baseURL: 'https://sendtick.co',
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
						name: 'Media',
						value: 'media',
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
					const mediaUrl = this.getNodeParameter('mediaUrl', i) as string;
					const fileName = this.getNodeParameter('fileName', i) as string;

					// Validate required sessionId
					if (!sessionId) {
						throw new NodeOperationError(this.getNode(), 'sessionId is required for sending messages');
					}

					// Validate `to` format: digits only, no leading '+'
					if (!/^[0-9]+$/.test(to)) {
						throw new NodeOperationError(this.getNode(), 'Invalid `to` format. Use digits only without a leading "+" (for example: 60123456789)');
					}

					// Require either message or mediaUrl
					if (!message && !mediaUrl) {
						throw new NodeOperationError(this.getNode(), 'Either `message` or `mediaUrl` must be provided');
					}

					const body: { [key: string]: any } = {
						sessionId,
						to,
					};
					if (message) body.message = message;
					if (mediaUrl) body.mediaUrl = mediaUrl;
					if (fileName) body.fileName = fileName;

					// Use the credential `sendtickApi` (defined in credentials file)
					const response = await this.helpers.requestWithAuthentication.call(this, 'sendtickApi', {
						method: 'POST',
						url: '/api/v1/messages',
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
							url: '/api/v1/contacts',
							body,
							json: true,
						});

						returnData.push({ json: response as any });
					} else if (operation === 'get') {
						const contactId = this.getNodeParameter('contactId', i) as string;
						const response = await this.helpers.requestWithAuthentication.call(this, 'sendtickApi', {
							method: 'GET',
							url: `/api/v1/contacts/${contactId}`,
							json: true,
						});

						returnData.push({ json: response as any });
					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						if (returnAll) {
							const response = await this.helpers.requestWithAuthentication.call(this, 'sendtickApi', {
								method: 'GET',
								url: '/api/v1/contacts',
								json: true,
							});
							returnData.push({ json: response as any });
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const response = await this.helpers.requestWithAuthentication.call(this, 'sendtickApi', {
								method: 'GET',
								url: '/api/v1/contacts',
								qs: { limit },
								json: true,
							});
							returnData.push({ json: response as any });
						}
					} else if (operation === 'update') {
						const contactId = this.getNodeParameter('contactId', i) as string;
						const name = this.getNodeParameter('name', i) as string;
						const email = this.getNodeParameter('email', i) as string;

						const body: { [key: string]: any } = {};
						if (name) body.name = name;
						if (email) body.email = email;

						const response = await this.helpers.requestWithAuthentication.call(this, 'sendtickApi', {
							method: 'PUT',
							url: `/api/v1/contacts/${contactId}`,
							body,
							json: true,
						});

						returnData.push({ json: response as any });
					} else if (operation === 'delete') {
						const contactId = this.getNodeParameter('contactId', i) as string;
						const response = await this.helpers.requestWithAuthentication.call(this, 'sendtickApi', {
							method: 'DELETE',
							url: `/api/v1/contacts/${contactId}`,
							json: true,
						});

						returnData.push({ json: response as any });
					}
				} else if (resource === 'media') {
					if (operation === 'upload') {
						const fileUrl = this.getNodeParameter('fileUrl', i) as string;
						const body = { url: fileUrl };

						const response = await this.helpers.requestWithAuthentication.call(this, 'sendtickApi', {
							method: 'POST',
							url: '/api/v1/media',
							body,
							json: true,
						});

						returnData.push({ json: response as any });
					} else if (operation === 'get') {
						const mediaId = this.getNodeParameter('mediaId', i) as string;
						const response = await this.helpers.requestWithAuthentication.call(this, 'sendtickApi', {
							method: 'GET',
							url: `/api/v1/media/${mediaId}`,
							json: true,
						});

						returnData.push({ json: response as any });
					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						if (returnAll) {
							const response = await this.helpers.requestWithAuthentication.call(this, 'sendtickApi', {
								method: 'GET',
								url: '/api/v1/media',
								json: true,
							});
							returnData.push({ json: response as any });
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const response = await this.helpers.requestWithAuthentication.call(this, 'sendtickApi', {
								method: 'GET',
								url: '/api/v1/media',
								qs: { limit },
								json: true,
							});
							returnData.push({ json: response as any });
						}
					}
				} else if (resource === 'session') {
					if (operation === 'getAll') {
						const response = await this.helpers.requestWithAuthentication.call(this, 'sendtickApi', {
							method: 'GET',
							url: '/api/v1/sessions',
							json: true,
						});

						returnData.push({ json: response as any });
					} else if (operation === 'get') {
						const sessionId = this.getNodeParameter('sessionId', i) as string;
						const response = await this.helpers.requestWithAuthentication.call(this, 'sendtickApi', {
							method: 'GET',
							url: `/api/v1/sessions/${sessionId}`,
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
