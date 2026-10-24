/* @layer renderer-app @kind hook */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { useActiveDocument } from '../../../hooks/useActiveDocument';
import { useViewStore } from '../../../stores/useViewStore';
import { toggleItem } from '../../../toolbar-items';
import { useHintKeys } from '../../ActionHint';
import { TILED_HINT, VIEW_HINTS, VIEW_ICONS, VIEW_TOGGLES } from '../CanvasToolbar.constants';
import { tiledGroups } from './tiled-groups';

const useViewItems = (): ToolbarItem[] => {
  const disabled = useActiveDocument() === null;
  const view = useViewStore();
  const keys = {
    grid: useHintKeys(VIEW_HINTS.grid),
    gridMajor: useHintKeys(VIEW_HINTS.gridMajor),
    gridTile: useHintKeys(VIEW_HINTS.gridTile),
    rulers: useHintKeys(VIEW_HINTS.rulers),
  };
  const toggles = VIEW_TOGGLES.map((toggle) =>
    toggleItem({
      id: toggle, icon: VIEW_ICONS[toggle], hint: VIEW_HINTS[toggle], keys: keys[toggle], disabled, pressed: view[toggle], onChange: () => view.toggleView(toggle),
    }),
  );
  const tiled = toggleItem({
    id: 'tiled',
    icon: 'copy',
    hint: TILED_HINT,
    disabled,
    pressed: view.tiled !== 'off',
    onChange: (on) => view.setTiled(on ? 'both' : 'off'),
    options: tiledGroups(view.tiled, view.setTiled),
  });
  return [...toggles, tiled];
};

export { useViewItems };
