#!/usr/bin/env node
'use strict';

/**
 * Script to pull Ollama models defined in the .env file.
 * Reads OLLAMA_HOST, OLLAMA_PORT, OLLAMA_CHAT_MODEL, OLLAMA_EMBED_MODEL,
 * and OLLAMA_VISION_MODEL from .env and pulls each unique model via the
 * Ollama REST API.
 *
 * Usage:
 *   node scripts/install-ollama-models.cjs
 *   npm run ollama:install
 */

const { resolve } = require('node:path');
const http = require('node:http');
const { config } = require('dotenv');

const ROOT_DIR = resolve(__dirname, '..');

// Load .env from project root
config({ path: resolve(ROOT_DIR, '.env') });

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Send a POST request to the Ollama /api/pull endpoint and stream the
 * progress back to stdout.
 *
 * @param {string} host
 * @param {number} port
 * @param {string} model
 * @returns {Promise<void>}
 */
function pullModel(host, port, model) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ name: model, stream: true });

    const options = {
      hostname: host,
      port,
      path: '/api/pull',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = http.request(options, (res) => {
      if (res.statusCode !== 200) {
        let errorBody = '';
        res.on('data', (chunk) => (errorBody += chunk));
        res.on('end', () =>
          reject(
            new Error(
              `HTTP ${res.statusCode} for model "${model}": ${errorBody}`,
            ),
          ),
        );
        return;
      }

      let buffer = '';

      res.on('data', (chunk) => {
        buffer += chunk.toString();
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? ''; // keep incomplete line in buffer

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          try {
            const json = JSON.parse(trimmed);
            if (json.status) {
              const total = json.total ? ` (${formatBytes(json.total)})` : '';
              const completed = json.completed
                ? ` – ${formatBytes(json.completed)} done`
                : '';
              process.stdout.write(
                `\r  ${json.status}${total}${completed}          `,
              );
            }
          } catch {
            // ignore non-JSON lines
          }
        }
      });

      res.on('end', () => {
        process.stdout.write('\n');
        resolve();
      });

      res.on('error', reject);
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

/**
 * Format bytes into a human-readable string.
 * @param {number} bytes
 */
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('🦙 Ollama Model Installer');
  console.log('='.repeat(40));

  const host = process.env.OLLAMA_HOST ?? 'localhost';
  const port = parseInt(process.env.OLLAMA_PORT ?? '11434', 10);

  // Collect unique, non-empty model names
  const modelKeys = ['OLLAMA_CHAT_MODEL', 'OLLAMA_EMBED_MODEL', 'OLLAMA_VISION_MODEL'];
  const models = [
    ...new Set(
      modelKeys
        .map((key) => process.env[key])
        .filter((m) => m && m.trim()),
    ),
  ];

  if (models.length === 0) {
    console.error(
      '❌  No Ollama models found.\n' +
        '    Set OLLAMA_CHAT_MODEL, OLLAMA_EMBED_MODEL, or OLLAMA_VISION_MODEL in your .env file.',
    );
    process.exit(1);
  }

  console.log(`🔗 Ollama endpoint : http://${host}:${port}`);
  console.log(`📦 Models to pull  : ${models.join(', ')}`);
  console.log('');

  // Pull each model
  for (const model of models) {
    console.log(`⬇️  Pulling model: ${model}`);
    try {
      await pullModel(host, port, model);
      console.log(`✅ Model "${model}" installed successfully.\n`);
    } catch (err) {
      console.error(`❌ Failed to pull model "${model}": ${err.message}\n`);
      process.exitCode = 1;
    }
  }

  if (process.exitCode === 1) {
    console.error('⚠️  Some models failed to install. See errors above.');
  } else {
    console.log('🎉 All models installed successfully!');
  }
}

main().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
