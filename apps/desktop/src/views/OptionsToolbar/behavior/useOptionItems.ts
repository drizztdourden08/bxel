/* @layer renderer-app @kind hook */
import type { OptionItems } from '../OptionsToolbar.type';
import { useBrushItems } from './useBrushItems';
import { useFillItems } from './useFillItems';
import { useMapFilledItems } from './useMapFilledItems';
import { useMapFlagItems } from './useMapFlagItems';
import { useMapSelectionItems } from './useMapSelectionItems';
import { usePixelPerfectItems } from './usePixelPerfectItems';
import { useSelectItems } from './useSelectItems';
import { useFillExtraItems } from './useFillExtraItems';
import { useFilledShapeItems } from './useFilledShapeItems';
import { useGradientItems } from './useGradientItems';
import { useInkItems } from './useInkItems';
import { useMapRandomItems } from './useMapRandomItems';
import { usePickItems } from './usePickItems';
import { useShapeExtraItems } from './useShapeExtraItems';
import { useSprayItems } from './useSprayItems';
import { useSymmetryItems } from './useSymmetryItems';

const useOptionItems = (): OptionItems => ({
  brush: useBrushItems(),
  pixelPerfect: usePixelPerfectItems(),
  fill: useFillItems(),
  ink: useInkItems(),
  pick: usePickItems(),
  fillExtras: useFillExtraItems(),
  spray: useSprayItems(),
  gradient: useGradientItems(),
  filledShape: useFilledShapeItems(),
  shapeExtras: useShapeExtraItems(),
  symmetry: useSymmetryItems(),
  mapRandom: useMapRandomItems(),
  select: useSelectItems(),
  mapFlags: useMapFlagItems(),
  mapFilled: useMapFilledItems(),
  mapSelection: useMapSelectionItems(),
});

export { useOptionItems };
