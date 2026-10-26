/* @layer renderer-app @kind logic */
import type { MenuEntry, MenuItem } from '@drizztdourden08/brock-react';
import { COMMAND_ID, TILED_COMMAND } from '../keymap/keymap.constants';
import { TILE_LABELS, TILE_MODES } from '../stores/view-store.constants';
import { hasPart } from '../surface/has-part';
import type { SurfacePart } from '../surface/surface.type';
import { MENU_KEYS, MENU_TEXT } from './editor-menu.constants';
import type { EditorMenuState } from './editor-menu.type';
import { menuItem } from './menu-item';

const off = (state: EditorMenuState): { disabled: boolean } => ({ disabled: !state.hasDocument });

const zoomEntries = (state: EditorMenuState): MenuEntry[] => [
  {
    key: 'view-zoom',
    label: MENU_TEXT.zoom,
    icon: 'zoom-in',
    children: [
      menuItem(COMMAND_ID.zoomIn, 'Zoom in', off(state)),
      menuItem(COMMAND_ID.zoomOut, 'Zoom out', off(state)),
      menuItem(COMMAND_ID.zoomFit, 'Zoom to fit', off(state)),
      menuItem(COMMAND_ID.zoomActual, 'Actual size', off(state)),
    ],
  },
];

const gridEntries = (state: EditorMenuState): MenuEntry[] => [
  {
    key: 'view-grid',
    label: MENU_TEXT.grid,
    children: [
      menuItem(COMMAND_ID.pixelGrid, 'Pixel grid', { ...off(state), checked: state.grid }),
      menuItem(COMMAND_ID.majorGrid, 'Major grid', { ...off(state), checked: state.gridMajor }),
      menuItem(COMMAND_ID.tileGrid, 'Tile grid', { ...off(state), checked: state.gridTile }),
    ],
  },
  menuItem(COMMAND_ID.rulers, 'Rulers', { ...off(state), checked: state.rulers }),
];

const guideEntries = (state: EditorMenuState): MenuEntry[] => [menuItem(COMMAND_ID.guides, 'Guides', { ...off(state), checked: state.guides })];

const symmetryEntries = (state: EditorMenuState): MenuEntry[] => [
  {
    key: 'view-symmetry',
    label: MENU_TEXT.symmetry,
    children: [
      menuItem(COMMAND_ID.symmetryX, MENU_TEXT.mirrorX, { ...off(state), checked: state.symmetryX }),
      menuItem(COMMAND_ID.symmetryY, MENU_TEXT.mirrorY, { ...off(state), checked: state.symmetryY }),
    ],
  },
];

const tiledEntries = (state: EditorMenuState): MenuEntry[] => [
  {
    key: 'view-tiled',
    label: MENU_TEXT.tiled,
    children: TILE_MODES.map((mode) => menuItem(TILED_COMMAND[mode], TILE_LABELS[mode], { ...off(state), checked: state.tiled === mode })),
  },
];

const viewMenu = (state: EditorMenuState): MenuItem => {
  const surface = state.hasDocument ? state.surface : 'sprite';
  const has = (part: SurfacePart): boolean => hasPart(surface, part);
  return {
    key: MENU_KEYS.view,
    label: MENU_TEXT.view,
    icon: 'eye',
    children: [
      ...(has('zoom') ? zoomEntries(state) : []),
      ...(has('view') ? gridEntries(state) : []),
      ...(has('guides') ? guideEntries(state) : []),
      ...(has('symmetry') ? symmetryEntries(state) : []),
      ...(has('tiled') ? tiledEntries(state) : []),
    ],
  };
};

export { viewMenu };
