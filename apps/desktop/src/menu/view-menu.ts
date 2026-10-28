/* @layer renderer-app @kind logic */
import type { MenuItem } from '@drizztdourden08/brock-react';
import { COMMAND_ID, TILED_COMMAND } from '../keymap/keymap.constants';
import { TILE_LABELS, TILE_MODES } from '../stores/view-store.constants';
import { evaluate } from '../ui-context/evaluate';
import { MENU_KEYS, MENU_TEXT } from './editor-menu.constants';
import type { EditorMenuState } from './editor-menu.type';
import { ruledItem } from './ruled-item';
import { tidyMenu } from './tidy-menu';
import type { Draft } from './tidy-menu.type';

const group = (state: EditorMenuState, rule: string, head: Pick<MenuItem, 'key' | 'label' | 'icon'>, children: readonly Draft[]): MenuItem | null =>
  evaluate(rule, state.context).state === 'hidden' ? null : { ...head, children: tidyMenu(children) };

const viewMenu = (state: EditorMenuState): MenuItem => {
  const { context } = state;
  const item = (id: string, label: string, checked?: boolean) => ruledItem(context, id, label, checked === undefined ? {} : { checked });
  return {
    key: MENU_KEYS.view,
    label: MENU_TEXT.view,
    icon: 'eye',
    children: tidyMenu([
      group(state, 'menu.view.zoom', { key: 'view-zoom', label: MENU_TEXT.zoom, icon: 'zoom-in' }, [
        item(COMMAND_ID.zoomIn, 'Zoom in'),
        item(COMMAND_ID.zoomOut, 'Zoom out'),
        item(COMMAND_ID.zoomFit, 'Zoom to fit'),
        item(COMMAND_ID.zoomActual, 'Actual size'),
        item(COMMAND_ID.zoomSelection, 'Zoom to selection'),
      ]),
      group(state, 'menu.view.grid', { key: 'view-grid', label: MENU_TEXT.grid }, [
        item(COMMAND_ID.pixelGrid, 'Pixel grid', state.grid),
        item(COMMAND_ID.majorGrid, 'Major grid', state.gridMajor),
        item(COMMAND_ID.tileGrid, 'Tile grid', state.gridTile),
      ]),
      item(COMMAND_ID.rulers, 'Rulers', state.rulers),
      item(COMMAND_ID.guides, 'Guides', state.guides),
      item(COMMAND_ID.snap, 'Snap', state.snap),
      group(state, 'menu.view.symmetry', { key: 'view-symmetry', label: MENU_TEXT.symmetry }, [
        item(COMMAND_ID.symmetryX, MENU_TEXT.mirrorX, state.symmetryX),
        item(COMMAND_ID.symmetryY, MENU_TEXT.mirrorY, state.symmetryY),
      ]),
      group(
        state,
        'menu.view.tiled',
        { key: 'view-tiled', label: MENU_TEXT.tiled },
        TILE_MODES.map((mode) => item(TILED_COMMAND[mode], TILE_LABELS[mode], state.tiled === mode)),
      ),
    ]),
  };
};

export { viewMenu };
