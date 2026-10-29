/* @layer renderer-app @kind types */
type ToolId =
  | 'pencil'
  | 'eraser'
  | 'spray'
  | 'shade'
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
  | 'move'
  | 'slice';

type StrokeTool = 'pencil' | 'eraser';

type ShapeTool = 'line' | 'rect' | 'ellipse';

type PathTool = 'curve' | 'polygon' | 'contour';

export type { PathTool, ShapeTool, StrokeTool, ToolId };
