/* @layer renderer-app @kind types */
import type { ScopeChipModel } from '../../sheet/sheet.type';

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

interface ScopeMenusProps {
  chips: ScopeChipModel;
}

export type { ScopeChipProps, ScopeChipView, ScopeMenusProps };
