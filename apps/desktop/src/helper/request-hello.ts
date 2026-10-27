/* @layer helper @kind logic */
import { CONTRACT_VERSION } from '@bxel/mcp';
import type { HelloClient, HelloReply } from '@bxel/mcp';
import type { BridgeClient } from '@drizztdourden08/brock-electron/bridge';
import { HELLO_ROUTE } from '../assistant-bridge/bridge-routes.constants';
import { HELPER_INFO } from './helper.constants';

const requestHello = (link: BridgeClient, client: HelloClient, launchToken: string | null): Promise<HelloReply> => {
  const launch = launchToken === null ? {} : { launchToken };
  return link.request(HELLO_ROUTE, { contract: CONTRACT_VERSION, helperVersion: HELPER_INFO.version, client, ...launch });
};

export { requestHello };
