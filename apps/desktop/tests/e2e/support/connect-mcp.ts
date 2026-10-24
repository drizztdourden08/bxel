/* @layer renderer-app @kind logic */
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { getDefaultEnvironment, StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import type { ClientConfig, McpLink } from './mcp.type';

const connectMcp = async (config: ClientConfig, extraEnv: Readonly<Record<string, string>> = {}): Promise<McpLink> => {
  const transport = new StdioClientTransport({
    command: config.command,
    args: [...config.args],
    env: { ...getDefaultEnvironment(), ...config.env, ...extraEnv },
    stderr: 'pipe',
  });
  const lines: string[] = [];
  transport.stderr?.on('data', (chunk: Buffer) => lines.push(chunk.toString('utf8')));
  const client = new Client({ name: 'bxel-check7', version: '1.0.0' });
  await client.connect(transport);
  return { client, stderr: () => lines.join(''), close: () => client.close() };
};

export { connectMcp };
