/* @layer renderer-app @kind types */
import type { ScopeChipModel } from '../../sheet/sheet.type';

type OptionKind = 'brush' | 'pixelPerfect' | 'fill' | 'shape' | 'symmetry' | 'select';

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

export type { OptionKind, ScopeChipProps, ScopeChipView, ScopeMenusProps };
