/* @layer renderer-app @kind types */
type ToolId = 'pencil' | 'eraser' | 'fill' | 'picker' | 'shape' | 'zoom' | 'hand';

type StrokeTool = 'pencil' | 'eraser';

type ToolGroup = 'draw' | 'view';

interface ToolDef {
  id: ToolId;
  label: string;
  key: string;
  group: ToolGroup;
}

export type { StrokeTool, ToolDef, ToolGroup, ToolId };
