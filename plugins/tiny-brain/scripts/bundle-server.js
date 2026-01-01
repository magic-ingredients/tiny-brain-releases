#!/usr/bin/env node
/**
 * Bundle the MCP server entry point with all dependencies
 * into a single self-contained file for plugin distribution.
 */
import * as esbuild from 'esbuild';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pluginRoot = join(__dirname, '..');

// Read version from package.json
const packageJson = JSON.parse(readFileSync(join(pluginRoot, 'package.json'), 'utf-8'));
const VERSION = packageJson.version;

async function bundle() {
  console.log(`📦 Bundling MCP server v${VERSION}...`);

  await esbuild.build({
    entryPoints: [join(pluginRoot, 'src/server-entry.ts')],
    bundle: true,
    platform: 'node',
    target: 'node18',
    format: 'esm',
    outfile: join(pluginRoot, 'server/entry.js'),
    minify: false, // Keep readable for debugging
    sourcemap: false,
    external: [], // Bundle everything
    banner: {
      js: `#!/usr/bin/env node
/**
 * tiny-brain MCP Server v${VERSION}
 * Bundled entry point - all dependencies included
 * Generated: ${new Date().toISOString()}
 */`,
    },
    define: {
      'process.env.TINY_BRAIN_VERSION': JSON.stringify(VERSION),
    },
  });

  console.log('✅ Bundle complete: server/entry.js');
}

bundle().catch((err) => {
  console.error('❌ Bundle failed:', err);
  process.exit(1);
});
