/* @layer renderer-app @kind logic */
import type { EditorAction, KeyLike } from './editor.type';
import { LAYER_KEYS, REDO_KEY, SWAP_KEY, TOOL_BY_KEY, UNDO_KEY } from './tools.constants';

const commandAction = (key: string, shift: boolean): EditorAction | null => {
  if (key === UNDO_KEY) return { kind: shift ? 'redo' : 'undo' };
  if (key === REDO_KEY) return { kind: 'redo' };
  const op = LAYER_KEYS.command.get(key);
  return op ? { kind: 'layer', op } : null;
};

const keyAction = (event: KeyLike): EditorAction | null => {
  const key = event.key.toLowerCase();
  if (event.ctrlKey || event.metaKey) return commandAction(key, event.shiftKey);
  if (event.altKey) return null;
  if (event.shiftKey && key === LAYER_KEYS.add) return { kind: 'layer', op: 'add' };
  if (key === SWAP_KEY) return { kind: 'swap' };
  const tool = TOOL_BY_KEY.get(key);
  return tool ? { kind: 'tool', tool } : null;
};

export { keyAction };
