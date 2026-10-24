/* @layer helper @kind entry */
import { buildTools } from '@bxel/mcp';
import { bridgeDiscoveryFile, BRIDGE_FILE_ENV } from '@drizztdourden08/brock-electron/bridge';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { APP_COMMANDS } from '../documents/document-host.constants';
import { createBridgeSession } from './create-bridge-session';
import { createServer } from './create-server';
import { APP_ID, HELPER_TEXT } from './helper.constants';
import { helperLog } from './helper-log';
import type { HelperState } from './helper.type';

const file = process.env[BRIDGE_FILE_ENV] ?? bridgeDiscoveryFile(APP_ID);

const state: HelperState = {
  file,
  session: createBridgeSession(file),
  tools: new Map(buildTools(APP_COMMANDS).map((tool) => [tool.name, tool])),
  started: null,
};

const shutdown = async (): Promise<void> => {
  await state.session.bye().catch(() => undefined);
  helperLog('stdin closed; the helper ends');
  process.exit(0);
};

process.on('uncaughtException', (error) => {
  helperLog(HELPER_TEXT.fatal(error.stack ?? error.message));
  process.exit(1);
});

const transport = new StdioServerTransport();
transport.onclose = () => void shutdown();
process.stdin.once('end', () => void shutdown());

void createServer(state)
  .connect(transport)
  .then(() => helperLog(`ready; bridge file ${file}`));
