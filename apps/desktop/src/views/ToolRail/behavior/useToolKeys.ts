/* @layer renderer-app @kind hook */
import type { ShortcutKey } from '@drizztdourden08/tessera';
import type { ToolId } from '../../../editor/tool.type';
import { COMMAND_ID } from '../../../keymap/keymap.constants';
import { useCommandKeys } from '../../ActionHint';

const useToolKeys = (): Readonly<Record<ToolId, readonly ShortcutKey[] | undefined>> => ({
  pencil: useCommandKeys(COMMAND_ID.tool('pencil'))[0],
  eraser: useCommandKeys(COMMAND_ID.tool('eraser'))[0],
  fill: useCommandKeys(COMMAND_ID.tool('fill'))[0],
  picker: useCommandKeys(COMMAND_ID.tool('picker'))[0],
  shape: useCommandKeys(COMMAND_ID.tool('shape'))[0],
  zoom: useCommandKeys(COMMAND_ID.tool('zoom'))[0],
  hand: useCommandKeys(COMMAND_ID.tool('hand'))[0],
  select: useCommandKeys(COMMAND_ID.tool('select'))[0],
  move: useCommandKeys(COMMAND_ID.tool('move'))[0],
});

export { useToolKeys };
