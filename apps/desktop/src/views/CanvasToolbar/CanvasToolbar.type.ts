/* @layer renderer-app @kind types */
import type { IconName, ShortcutKey, ToolbarItem, ToolbarSlot } from '@drizztdourden08/tessera';
import type { SurfacePart } from '../../surface/surface.type';
import type { HintSpec } from '../ActionHint';

interface CanvasToolbarProps {
  slot: ToolbarSlot;
}

interface CanvasGroup {
  id: string;
  part: SurfacePart | null;
  items: readonly ToolbarItem[];
}

interface TransformAction {
  id: string;
  hint: HintSpec;
  icon?: IconName;
  needsSelection?: boolean;
  run: () => void;
}

type TransformKeys = Readonly<Record<string, readonly ShortcutKey[] | undefined>>;

export type { CanvasGroup, CanvasToolbarProps, TransformAction, TransformKeys };
