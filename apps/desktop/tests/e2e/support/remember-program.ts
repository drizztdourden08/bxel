/* @layer renderer-app @kind logic */
import { expect } from 'vitest';
import { approvePairing } from './approve-pairing';
import { callMcp } from './call-mcp';
import { connectMcp } from './connect-mcp';
import { CANVAS_LABEL, POLL_MS } from './e2e.constants';
import type { Session } from './e2e.type';
import { enableAssistant } from './enable-assistant';
import { launchBuiltApp } from './launch-built-app';
import { MCP_CLIENT_NAME } from './mcp.constants';
import type { ClientConfig } from './mcp.type';
import { readClientConfig } from './read-client-config';
import { savedSettingsContain } from './saved-settings-contain';

const pairAndRemember = async (session: Session, userData: string): Promise<ClientConfig> => {
  await session.page.getByRole('application', { name: CANVAS_LABEL }).waitFor();
  await enableAssistant(session, session.dir);
  const config = await readClientConfig(session.page);
  const link = await connectMcp(config);
  try {
    const pairing = callMcp(link.client, 'get_session');
    await approvePairing(session.page, 'Allow editing');
    expect((await pairing).data).toMatchObject({ ok: true, mode: 'edit', trust: 'prompted' });
    await expect.poll(() => savedSettingsContain(userData, MCP_CLIENT_NAME), { timeout: POLL_MS }).toBe(true);
    return config;
  } finally {
    await link.close();
  }
};

const rememberProgram = async (userData: string, folder: string): Promise<ClientConfig> => {
  const launched = await launchBuiltApp(userData);
  try {
    return await pairAndRemember({ app: launched.app, page: launched.page, dir: folder, close: launched.close }, userData);
  } finally {
    await launched.close();
  }
};

export { rememberProgram };
