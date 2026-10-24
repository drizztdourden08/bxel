/* @layer electron-main @kind logic */
import type { ToolReply } from '@bxel/mcp';
import type { AssistantMain } from './assistant.type';
import { toolReply } from './tool-reply';

const showWindow = async (state: AssistantMain): Promise<ToolReply> => {
  if (state.instance.window !== 'headless') return toolReply({ ok: true, shown: false, window: 'visible' });
  await state.ctx?.window.show();
  state.instance.window = 'visible';
  state.ctx?.tray.clear();
  return toolReply({ ok: true, shown: true, window: 'visible' });
};

export { showWindow };
