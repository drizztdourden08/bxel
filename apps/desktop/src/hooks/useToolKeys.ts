/* @layer renderer-app @kind hook */
import type { ShortcutKey } from '@drizztdourden08/tessera';
import type { ToolId } from '../editor/tool.type';
import { COMMAND_ID } from '../keymap/keymap.constants';
import { useKeysOf } from './useKeysOf';

const useToolKeys = (): ((tool: ToolId) => ShortcutKey[] | undefined) => {
  const keysOf = useKeysOf();
  return (tool) => keysOf(COMMAND_ID.tool(tool));
};

export { useToolKeys };
