# n8n-nodes-sendtick-v1

Lightweight n8n node set to interact with Sendtick (v1) APIs. Provides operations for sending messages, creating contacts, and querying sessions from n8n workflows.

## Features
- Send messages
- Create or update contacts
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
	- Operation: create, get, getAll, update, delete

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
