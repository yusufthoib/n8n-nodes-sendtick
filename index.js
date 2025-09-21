/**
 * Entry point for the n8n node package.
 * Export all node files from ./nodes here.
 *
 * Create node implementations in ./nodes (for example: SendTick.node.js)
 */

module.exports = {
	version: 1,
	nodes: [
		// Add your node files here. Example:
		// require('./nodes/SendTick.node.js'),
	],
	credentials: [
		// Add credential files if you have any, e.g.:
		// require('./credentials/MyService.credentials.js'),
	],
};
