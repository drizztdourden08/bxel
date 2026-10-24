/* @layer renderer-app @kind constants */
import type { ComponentType } from 'react';
import type { OptionKind } from '../ContextBar.type';
import { BrushOptions } from './BrushOptions';
import { FillOptions } from './FillOptions';
import { MapFilledOption } from './MapFilledOption';
import { MapFlagOptions } from './MapFlagOptions';
import { MapSelectionOptions } from './MapSelectionOptions';
import { PixelPerfectOption } from './PixelPerfectOption';
import { SelectOptions } from './SelectOptions';
import { ShapeOptions } from './ShapeOptions';
import { SymmetryOptions } from './SymmetryOptions';

const OPTION_VIEWS: Readonly<Record<OptionKind, ComponentType>> = {
  shape: ShapeOptions,
  brush: BrushOptions,
  pixelPerfect: PixelPerfectOption,
  fill: FillOptions,
  symmetry: SymmetryOptions,
  select: SelectOptions,
  mapFlags: MapFlagOptions,
  mapFilled: MapFilledOption,
  mapSelection: MapSelectionOptions,
};

export { OPTION_VIEWS };
