/* @layer renderer-app @kind types */
import type { MenuGroup, ShortcutKey, ToolbarSlot } from '@drizztdourden08/tessera';
import type { ToolDef, ToolId } from '../../editor/tool.type';
import type { PixelIconName } from '../../icons/pixel-icon.type';
import type { BxelContext } from '../../ui-context/bxel-context.type';

interface ToolRailProps {
  slot: ToolbarSlot;
}

interface RailItemContext {
  defs: readonly ToolDef[];
  tool: ToolId;
  icons: Readonly<Record<ToolId, PixelIconName>>;
  keys: Readonly<Record<ToolId, readonly ShortcutKey[] | undefined>>;
  options: Readonly<Partial<Record<ToolId, readonly MenuGroup[]>>>;
  pick: (tool: ToolId) => void;
  context: BxelContext;
}

export type { RailItemContext, ToolRailProps };
