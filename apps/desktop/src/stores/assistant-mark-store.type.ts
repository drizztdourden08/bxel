/* @layer renderer-app @kind types */
import type { ToolId } from '../editor/tool.type';

interface AssistantMarkState {
  tool: ToolId | null;
  flash: (tool: ToolId) => void;
  clear: () => void;
}

export type { AssistantMarkState };
