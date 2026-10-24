/* @layer renderer-app @kind types */
import type { CellFlags } from '@bxel/document';
import type { PixelIconName } from '../../icons/pixel-icon.type';
import type { ScopeChipModel } from '../../sheet/sheet.type';
import type { FlagOp } from '../../tilemap/tilemap.type';
import type { HintSpec } from '../ActionHint';

type OptionKind = 'brush' | 'pixelPerfect' | 'fill' | 'shape' | 'symmetry' | 'select' | 'mapFlags' | 'mapFilled' | 'mapSelection';

interface ToolOptionsProps {
  kinds: readonly OptionKind[];
}

interface FlagAction {
  op: FlagOp;
  flag: keyof CellFlags;
  icon: PixelIconName;
  hint: HintSpec;
}

interface FlagButtonProps {
  action: FlagAction;
  on: boolean;
}

interface ScopeMenusProps {
  chips: ScopeChipModel;
}

type ScopeChipKey = 'sprite' | 'layer' | 'frame';

interface ScopeChipView {
  key: ScopeChipKey;
  text: string;
  full: string;
  locked: boolean;
  danger: boolean;
}

interface ScopeChipProps {
  chip: ScopeChipView;
}

export type { FlagAction, FlagButtonProps, OptionKind, ScopeChipProps, ScopeChipView, ScopeMenusProps, ToolOptionsProps };
