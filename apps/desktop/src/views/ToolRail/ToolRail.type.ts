/* @layer renderer-app @kind types */
import type { MenuGroup, ShortcutKey } from '@drizztdourden08/tessera';
import type { ToolDef, ToolId } from '../../editor/tool.type';
import type { StockPixelIconName } from '../../icons/pixel-icon.type';

interface ToolButtonProps {
  def: ToolDef;
  active: boolean;
  onSelect: () => void;
}

interface RailItemContext {
  tool: ToolId;
  icons: Readonly<Record<ToolId, StockPixelIconName>>;
  keys: Readonly<Record<ToolId, readonly ShortcutKey[] | undefined>>;
  options: Readonly<Partial<Record<ToolId, readonly MenuGroup[]>>>;
  pick: (tool: ToolId) => void;
}

export type { RailItemContext, ToolButtonProps };
