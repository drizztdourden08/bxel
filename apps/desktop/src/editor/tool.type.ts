/* @layer renderer-app @kind types */
type ToolId =
  | 'pencil'
  | 'eraser'
  | 'spray'
  | 'fill'
  | 'gradient'
  | 'picker'
  | 'line'
  | 'curve'
  | 'rect'
  | 'ellipse'
  | 'contour'
  | 'polygon'
  | 'zoom'
  | 'hand'
  | 'select'
  | 'move';

type StrokeTool = 'pencil' | 'eraser';

type ShapeTool = 'line' | 'rect' | 'ellipse';

type PathTool = 'curve' | 'polygon' | 'contour';

type ToolGroup = 'draw' | 'select' | 'view';

interface ToolDef {
  id: ToolId;
  label: string;
  description: string;
  key: string;
  group: ToolGroup;
}

export type { PathTool, ShapeTool, StrokeTool, ToolDef, ToolGroup, ToolId };
