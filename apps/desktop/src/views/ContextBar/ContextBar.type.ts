/* @layer renderer-app @kind types */
import type { ScopeChipModel } from '../../sheet/sheet.type';

type OptionKind = 'brush' | 'pixelPerfect' | 'fill' | 'shape' | 'symmetry' | 'select';

interface ScopeMenusProps {
  chips: ScopeChipModel;
}

export type { OptionKind, ScopeMenusProps };
