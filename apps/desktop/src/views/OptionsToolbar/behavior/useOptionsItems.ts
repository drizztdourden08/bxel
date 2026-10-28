/* @layer renderer-app @kind hook */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { useToolStore } from '../../../stores/useToolStore';
import { ruledItems } from '../../../toolbar-items/ruled-items';
import { tidyItems } from '../../../toolbar-items/tidy-items';
import { evaluate } from '../../../ui-context/evaluate';
import { useBxelContext } from '../../../ui-context/useBxelContext';
import { MAP_TOOL_OPTIONS, TOOL_OPTIONS } from '../OptionsToolbar.constants';
import { joinOptions } from './join-options';
import { useOptionItems } from './useOptionItems';
import { useTileModeItems } from './useTileModeItems';
import { useTileOverlayItems } from './useTileOverlayItems';

const useOptionsItems = (): ToolbarItem[] => {
  const tool = useToolStore((state) => state.tool);
  const context = useBxelContext((current) => current);
  const items = useOptionItems();
  const mode = ruledItems(useTileModeItems(), context);
  const overlay = ruledItems(useTileOverlayItems(), context);
  const kinds = context.surface === 'map' ? MAP_TOOL_OPTIONS[tool] : TOOL_OPTIONS[tool];
  const options = joinOptions(kinds, items);
  const gap = mode.length > 0 && options.length > 0 ? [{ kind: 'separator' as const, id: 'after-tile-mode' }] : [];
  return evaluate('toolbar.options', context).state === 'hidden' ? [] : tidyItems([...mode, ...overlay, ...gap, ...options]);
};

export { useOptionsItems };
