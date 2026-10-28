/* @layer renderer-app @kind logic */
import { expect } from 'vitest';
import { approvePairing } from './approve-pairing';
import { callMcp } from './call-mcp';
import { connectMcp } from './connect-mcp';
import { enableAssistant } from './enable-assistant';
import type { McpRig } from './mcp-rig.type';
import { openSession } from './open-session';
import { readClientConfig } from './read-client-config';

const openMcpRig = async (choice: 'Allow editing' | 'Full control' = 'Allow editing'): Promise<McpRig> => {
  const session = await openSession();
  await enableAssistant(session, session.dir);
  const config = await readClientConfig(session.page);
  const link = await connectMcp(config);
  const pairing = callMcp(link.client, 'get_session');
  await approvePairing(session.page, choice);
  const paired = await pairing;
  expect(paired.data).toMatchObject({ ok: true, mode: 'edit', trust: 'prompted' });
  const close = session.close;
  return {
    session: { ...session, close: () => link.close().then(close) },
    link,
    config,
    folder: session.dir,
    sessionId: String(paired.data.sessionId),
  };
};

export { openMcpRig };
