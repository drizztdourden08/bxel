/* @layer renderer-app @kind types */
type ToolId = 'pencil' | 'eraser' | 'fill' | 'picker' | 'shape' | 'zoom' | 'hand' | 'select' | 'move';

type StrokeTool = 'pencil' | 'eraser';

type ToolGroup = 'draw' | 'select' | 'view';

interface ToolDef {
  id: ToolId;
  label: string;
  description: string;
  key: string;
  group: ToolGroup;
}

export type { StrokeTool, ToolDef, ToolGroup, ToolId };
