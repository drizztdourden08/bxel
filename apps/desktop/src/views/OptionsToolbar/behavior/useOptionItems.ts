/* @layer renderer-app @kind hook */
import type { OptionItems } from '../OptionsToolbar.type';
import { useBrushItems } from './useBrushItems';
import { useFillItems } from './useFillItems';
import { useMapFilledItems } from './useMapFilledItems';
import { useMapFlagItems } from './useMapFlagItems';
import { useMapSelectionItems } from './useMapSelectionItems';
import { usePixelPerfectItems } from './usePixelPerfectItems';
import { useSelectItems } from './useSelectItems';
import { useShapeItems } from './useShapeItems';

const useOptionItems = (): OptionItems => ({
  brush: useBrushItems(),
  pixelPerfect: usePixelPerfectItems(),
  fill: useFillItems(),
  shape: useShapeItems(),
  select: useSelectItems(),
  mapFlags: useMapFlagItems(),
  mapFilled: useMapFilledItems(),
  mapSelection: useMapSelectionItems(),
});

export { useOptionItems };
