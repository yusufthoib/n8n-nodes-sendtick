# n8n-nodes-sendtick-v1

Lightweight n8n node set to interact with Sendtick (v1) APIs. Provides operations for sending messages, searching/listing contacts, and querying sessions from n8n workflows.

## Features
- Send messages
- Search or list contacts
- Query message status
- Simple API-key based credential

## Requirements
- n8n v0.200.0 or later (verify compatibility with your n8n installation)
- Node.js >= 16

## Installation

Option 1 — Install from npm (package published)
1. Stop n8n.
2. In your n8n project or globally:  
	npm install n8n-nodes-sendtick-v1
3. Restart n8n.

Option 2 — Local development
1. Clone this repo into your workspace.
2. Install dependencies and build:
	npm install
	npm run build
3. Link or copy the built node files into your n8n custom nodes directory (or run n8n from repo during development).
4. Restart n8n.

## Credentials

Create a credential in n8n of type "SendTick API" (or supply environment variables used by this node):
- API Key: SENDTICK_API_KEY
- API Base URL (optional): SENDTICK_API_URL (defaults to https://api.sendtick.example)

The node uses the credential to sign requests.

## Nodes and Operations

Sendtick node (resources: message | contact | session)

- Resource: message
	- Operation: send
	- Parameters: to (string or expression), message (string), sessionId (string)
	- Example: send a transactional message to a phone or chat id.

- Resource: contact
	- Operation: get (single), getAll (search/list)

- Resource: session
	- Operation: get, getAll

All operations return JSON. API errors are forwarded as node errors.

## Example Workflow

1. Trigger (Webhook / Schedule / HTTP Request)
2. Set node: "SendTick — send message"
	- Resource: message
	- Operation: send
	- To: {{$json["phone"]}}
	- Body: Hello {{$json["firstName"]}}, your code is {{$json["code"]}}.
3. Use result in subsequent nodes (log, database, HTTP callback).

## Error handling
- Use n8n "Continue on Fail" when you want downstream steps to run after a failed SendTick request.
- Inspect node output for SendTick API error body and status code.

## Development

Scripts
- npm run build — transpile/types build
- npm test — run tests
- npm run lint — lint source

Contributing
- Open issues and PRs for bugs or feature requests.
- Follow the repo coding style and include tests for new behavior.

## License
MIT — see LICENSE file.

For API details, refer to your SendTick API documentation and update the URL/parameters accordingly.

## Send media via URL

The Sendtick node now supports sending media by URL when using the `message` resource with the `send` operation. Instead of (or in addition to) a text `message` body, provide a `mediaUrl` and `mediaType` to send images, audio, video, or documents hosted at a public URL.

Parameters (message send):
- mediaUrl (string) — Publicly accessible URL to the media file (required when sending media).
- mediaType (string) — MIME type or shorthand (e.g. `image/jpeg`, `image/png`, `video/mp4`, `audio/mpeg`, `application/pdf`).
- caption (string, optional) — Text caption to accompany the media.
- to (string) — Recipient phone/chat id (same as regular send).
- sessionId (string, optional) — Session identifier if required by your Sendtick account.

Behavior notes:
- The node will pass the `mediaUrl` and `mediaType` to the Sendtick API; the actual media upload is handled by the provider that hosts the URL. Ensure the URL is publicly reachable by the Sendtick service.
- If the API does not accept a remote URL for certain media types, use your own upload endpoint or contact Sendtick support.
- Provide a lightweight caption for accessibility and fallback when clients cannot render media.

n8n node example (fields in the Sendtick — send message node):

- Resource: message
- Operation: send
- To: {{$json["phone"]}}
- Media URL: https://cdn.example.com/invoices/12345.pdf
- Media Type: application/pdf
- Caption: Your invoice #12345

Fetch / direct API example (sending media by URL):

```js
fetch('https://api.sendtick.example/v1/messages', {
	method: 'POST',
	headers: {
		'Authorization': 'Bearer YOUR_API_KEY',
		'Content-Type': 'application/json'
	},
	body: JSON.stringify({
		to: '+1234567890',
		mediaUrl: 'https://cdn.example.com/images/photo.jpg',
		mediaType: 'image/jpeg',
		caption: 'Here is the photo you requested'
	})
})
.then(res => res.json())
.then(console.log)
.catch(console.error);
```

If your Sendtick API variant requires an uploaded binary instead of a remote URL, the node may support a file-upload flow in a later release; check the node changelog for updates.

## Search contacts

The Sendtick contacts endpoint supports query parameters to filter and paginate results. Available query parameters:

- query: Search query for name, email, or phone
- tag: Filter contacts by tag
- groupId: Filter contacts by group ID
- limit: Number of contacts to return (max 100)
- offset: Pagination offset

Example: Search contacts with query and tag

Using fetch

```js
fetch('https://sendtick.co/api/v1/contacts?query=john&tag=customer&limit=20', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
})
```
