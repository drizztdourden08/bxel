/* @layer renderer-app @kind hook */
import type { ToolId } from '../editor/tool.type';
import { SELECT_VARIANT_ICONS, SHAPE_FILLED_ICONS, TOOL_ICONS } from '../icons/tool-icons.constants';
import type { PixelIconName } from '../icons/pixel-icon.type';
import { useDrawingStore } from '../stores/useDrawingStore';
import { useSelectionStore } from '../stores/useSelectionStore';

const useToolIcon = (tool: ToolId): PixelIconName => {
  const filled = useDrawingStore((state) => (tool === 'rect' || tool === 'ellipse' ? state.filled[tool] : false));
  const variant = useSelectionStore((state) => state.variant);
  if (tool === 'rect' || tool === 'ellipse') return filled ? SHAPE_FILLED_ICONS[tool] : TOOL_ICONS[tool];
  if (tool === 'select') return SELECT_VARIANT_ICONS[variant];
  return TOOL_ICONS[tool];
};

export { useToolIcon };
