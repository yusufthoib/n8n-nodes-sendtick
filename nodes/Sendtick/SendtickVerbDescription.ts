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
				action: 'SEND A WHATSAPP MESSAGE',
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
				action: 'CREATE A CONTACT',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a contact',
				action: 'DELETE A CONTACT',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a single contact',
				action: 'GET A CONTACT',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many contacts',
				action: 'GET MANY CONTACTS',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a contact',
				action: 'UPDATE A CONTACT',
			},
		],
		default: 'getAll',
	},
	// Media operations (shown when resource is 'media')
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['media'],
			},
		},
		options: [
			{
				name: 'Upload',
				value: 'upload',
				description: 'Upload media via a public URL',
				action: 'UPLOAD MEDIA',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get media metadata',
				action: 'GET MEDIA',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'List media items',
				action: 'GET MANY MEDIA',
			},
		],
		default: 'upload',
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
				action: 'GET A SESSION',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many sessions',
				action: 'GET MANY SESSIONS',
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
		description: 'Optional public URL to media to send instead of a text message',
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
	{
		displayName: 'File Name',
		name: 'fileName',
		type: 'string',
		default: '',
		description: 'Optional filename for document messages',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
			},
		},
		routing: {
			send: {
				property: 'fileName',
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
/*                                  media ops                                  */
/* -------------------------------------------------------------------------- */
const mediaUpload: INodeProperties[] = [
	{
		displayName: 'File URL',
		name: 'fileUrl',
		type: 'string',
		default: '',
		required: true,
		description: 'Public URL to the file to upload (server will fetch it)',
		displayOptions: {
			show: {
				resource: ['media'],
				operation: ['upload'],
			},
		},
	},
];

const mediaGet: INodeProperties[] = [
	{
		displayName: 'Media ID',
		name: 'mediaId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['media'],
				operation: ['get'],
			},
		},
	},
];

const mediaGetAll: INodeProperties[] = [
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['media'],
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
				resource: ['media'],
				operation: ['getAll'],
				returnAll: [false],
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
	/*                                media operations                            */
	/* -------------------------------------------------------------------------- */
	...mediaUpload,
	...mediaGet,
	...mediaGetAll,
	/* -------------------------------------------------------------------------- */
	/*                                session operations                          */
	/* -------------------------------------------------------------------------- */
	...sessionGet,
	...sessionGetAll,
];
