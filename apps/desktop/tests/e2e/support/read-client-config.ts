/* @layer renderer-app @kind logic */
import type { Page } from 'playwright-core';
import type { ClientConfig } from './mcp.type';

const isConfig = (value: unknown): value is ClientConfig =>
  typeof value === 'object' && value !== null && 'command' in value && 'args' in value && 'env' in value;

const readClientConfig = async (page: Page): Promise<ClientConfig> => {
  const raw: unknown = await page.evaluate('window.api.assistantClientConfig()');
  if (!isConfig(raw)) throw new Error('Bxel did not return a client config');
  return raw;
};

export { readClientConfig };
