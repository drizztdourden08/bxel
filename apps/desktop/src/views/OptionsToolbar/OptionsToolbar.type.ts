/* @layer renderer-app @kind types */
import type { CellFlags } from '@bxel/document';
import type { IconName, ToolbarItem, ToolbarSlot } from '@drizztdourden08/tessera';
import type { FlagOp } from '../../tilemap/tilemap.type';
import type { HintSpec } from '../ActionHint';

type OptionKind = 'brush' | 'pixelPerfect' | 'fill' | 'shape' | 'select' | 'mapFlags' | 'mapFilled' | 'mapSelection';

type OptionItems = Readonly<Record<OptionKind, ToolbarItem[]>>;

interface OptionsToolbarProps {
  slot: ToolbarSlot;
}

interface FlagAction {
  op: FlagOp;
  flag: keyof CellFlags;
  icon: IconName;
  hint: HintSpec;
}

export type { FlagAction, OptionItems, OptionKind, OptionsToolbarProps };
