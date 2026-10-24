/* @layer renderer-app @kind hook */
import type { ToolId } from '../editor/tool.type';
import { SELECT_VARIANT_ICONS, SHAPE_FILLED_ICONS, SHAPE_KIND_ICONS, TOOL_ICONS } from '../icons/tool-icons.constants';
import type { PixelIconName } from '../icons/pixel-icon.type';
import { useSelectionStore } from '../stores/useSelectionStore';
import { useToolStore } from '../stores/useToolStore';

const useToolIcon = (tool: ToolId): PixelIconName => {
  const shape = useToolStore((state) => state.shape);
  const filled = useToolStore((state) => state.filled);
  const variant = useSelectionStore((state) => state.variant);
  if (tool === 'shape') return filled ? SHAPE_FILLED_ICONS[shape] : SHAPE_KIND_ICONS[shape];
  if (tool === 'select') return SELECT_VARIANT_ICONS[variant];
  return TOOL_ICONS[tool];
};

export { useToolIcon };
