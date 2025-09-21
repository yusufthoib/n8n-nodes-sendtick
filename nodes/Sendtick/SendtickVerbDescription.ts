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
				name: 'Create',
				value: 'create',
				description: 'Create a contact',
				action: 'Create contact',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a contact',
				action: 'Delete contact',
			},
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
			{
				name: 'Update',
				value: 'update',
				description: 'Update a contact',
				action: 'Update contact',
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
];

/* -------------------------------------------------------------------------- */
/*                                contact operations                           */
/* -------------------------------------------------------------------------- */
const contactCreate: INodeProperties[] = [
	{
		displayName: 'Phone',
		name: 'phone',
		type: 'string',
		default: '',
		required: true,
		description: 'Phone number with country code (E.164 preferred)',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		description: 'Contact display name',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		default: '',
		description: 'Optional contact email',
		placeholder: 'name@email.com',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['create'],
			},
		},
	},
];

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
				operation: ['get','update','delete'],
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

const contactUpdate: INodeProperties[] = [
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		description: 'New display name',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		default: '',
		description: 'New email',
		placeholder: 'name@email.com',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['update'],
			},
		},
	},
];


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
	...contactCreate,
	...contactGet,
	...contactGetAll,
	...contactUpdate,


	/* -------------------------------------------------------------------------- */
	/*                                session operations                          */
	/* -------------------------------------------------------------------------- */
	...sessionGet,
	...sessionGetAll,
];
