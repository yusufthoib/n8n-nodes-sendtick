import { INodeProperties } from 'n8n-workflow';

// When the resource `message` is selected, this `operation` parameter will be shown.
export const sendtickOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,

		displayOptions: {
			show: {
				resource: ['message'],
			},
		},
		options: [
			{
				name: 'Send Message',
				value: 'send',
				description: 'Send a WhatsApp message',
				action: 'Send message',
				routing: {
					request: {
						method: 'POST',
						url: '/messages',
					},
				},
			},
		],
		default: 'send',
	},
	// Contact operations (shown when resource is 'contact')
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['contact'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a single contact',
				action: 'Get contact',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many contacts',
				action: 'Get many contacts',
			},
		],
		default: 'getAll',
	},
	// Session operations (shown when resource is 'session')
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['session'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get details for a session',
				action: 'Get session',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many sessions',
				action: 'Get many sessions',
			},
		],
		default: 'getAll',
	},
];

// Here we define what to show when the `send` operation is selected.
// We do that by adding `operation: ["send"]` to `displayOptions.show`
const sendOperation: INodeProperties[] = [
	{
		displayName: 'To',
		name: 'to',
		type: 'string',
		default: '',
		required: true,
		description: 'Recipient phone number with country code',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
			},
		},
		routing: {
			send: {
				property: 'to',
				type: 'body',
			},
		},
	},
	{
		displayName: 'Session ID',
		name: 'sessionId',
		type: 'string',
		default: '',
		required: true,
		description: 'Select the WhatsApp session to send from (sessionId)',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
			},
		},
		routing: {
			send: {
				property: 'sessionId',
				type: 'body',
			},
		},
	},
	{
		displayName: 'Message',
		name: 'message',
		type: 'string',
		default: '',
		required: true,
		description: 'The message text to send',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
			},
		},
		routing: {
			send: {
				property: 'message',
				type: 'body',
			},
		},
	},
	{
		displayName: 'Media URL',
		name: 'mediaUrl',
		type: 'string',
		default: '',
		description: 'Public URL to an image or media to send (e.g. https://example.com/image.jpg)',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
			},
		},
		routing: {
			send: {
				property: 'mediaUrl',
				type: 'body',
			},
		},
	},
];

/* -------------------------------------------------------------------------- */
/*                                contact operations                           */
/* -------------------------------------------------------------------------- */
// contact create removed: Sendtick API does not provide create/delete/update operations in this integration

const contactGet: INodeProperties[] = [
 	{
 		displayName: 'Contact ID',
 		name: 'contactId',
 		type: 'string',
 		default: '',
 		required: true,
 		description: 'ID of the contact to retrieve',
 		displayOptions: {
 			show: {
 				resource: ['contact'],
 				operation: ['get'],
 			},
 		},
 	},
];

const contactGetAll: INodeProperties[] = [
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['getAll'],
			},
		},
	},
	{
		displayName: 'Search Query',
		name: 'query',
		type: 'string',
		default: '',
		description: 'Search query for name, email, or phone',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['getAll'],
			},
		},
	},
	{
		displayName: 'Tag',
		name: 'tag',
		type: 'string',
		default: '',
		description: 'Filter contacts by tag',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['getAll'],
			},
		},
	},
	{
		displayName: 'Group ID',
		name: 'groupId',
		type: 'string',
		default: '',
		description: 'Filter contacts by group ID',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['getAll'],
			},
		},
	},
	{
		displayName: 'Offset',
		name: 'offset',
		type: 'number',
		default: 0,
		typeOptions: {
			minValue: 0,
		},
		description: 'Pagination offset',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['getAll'],
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: {
			minValue: 1,
		},
		description: 'Max number of results to return',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
	},
];

// contact update removed: Sendtick API does not provide create/delete/update operations in this integration


/* -------------------------------------------------------------------------- */
/*                                session operations                           */
/* -------------------------------------------------------------------------- */
const sessionGet: INodeProperties[] = [
	{
		displayName: 'Session ID',
		name: 'sessionId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['session'],
				operation: ['get'],
			},
		},
	},
];

const sessionGetAll: INodeProperties[] = [
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['session'],
				operation: ['getAll'],
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: {
			minValue: 1,
		},
		description: 'Max number of results to return',
		displayOptions: {
			show: {
				resource: ['session'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
	},
];

export const sendtickFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                message:send                                */
	/* -------------------------------------------------------------------------- */
	...sendOperation,
	/* -------------------------------------------------------------------------- */
	/*                                contact operations                          */
	/* -------------------------------------------------------------------------- */
	...contactGet,
	...contactGetAll,


	/* -------------------------------------------------------------------------- */
	/*                                session operations                          */
	/* -------------------------------------------------------------------------- */
	...sessionGet,
	...sessionGetAll,
];
