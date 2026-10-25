/* @layer electron-main @kind logic */
import type { HandlerGroup } from '@drizztdourden08/brock-electron/main';
import { APP_CHANNELS } from '../../src/ipc/contract.constants';
import { copyDemo } from '../demo/copy-demo';

const demoHandlers: HandlerGroup = {
  id: 'demo',
  register: (ctx) => {
    ctx.handle(APP_CHANNELS.demoCopy, (_event, parent) => copyDemo(ctx, parent));
  },
};

export { demoHandlers };
