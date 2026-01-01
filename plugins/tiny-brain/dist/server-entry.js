/**
 * MCP Server entry point for tiny-brain plugin
 *
 * This file is bundled with esbuild to create a self-contained
 * server/entry.js with all dependencies included.
 */
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { MCPServer } from '@magic-ingredients/tiny-brain-local';
const VERSION = process.env.TINY_BRAIN_VERSION || '0.0.0';
async function main() {
    const server = new MCPServer({
        name: 'tiny-brain',
        version: VERSION,
        debug: {
            dataDir: process.env.TINY_BRAIN_HOME || '~/.tiny-brain',
            logLevel: process.env.TINY_BRAIN_LOG_LEVEL || 'info',
        },
    });
    await server.initialize();
    const transport = new StdioServerTransport();
    await server.connect(transport);
    process.on('SIGINT', async () => {
        await server.shutdown();
        process.exit(0);
    });
    process.on('SIGTERM', async () => {
        await server.shutdown();
        process.exit(0);
    });
}
main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
