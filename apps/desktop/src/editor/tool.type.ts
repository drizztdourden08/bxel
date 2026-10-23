/* @layer renderer-app @kind types */
type ToolId = 'pencil' | 'eraser' | 'fill' | 'picker';

type StrokeTool = 'pencil' | 'eraser';

interface ToolDef {
  id: ToolId;
  label: string;
  key: string;
}

export type { StrokeTool, ToolDef, ToolId };
