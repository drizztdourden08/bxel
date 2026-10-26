/* @layer renderer-app @kind constants */
import { MENU_KEYS, MENU_TEXT } from './editor-menu.constants';
import type { KindHead } from './kind-menu.type';

const KIND_HEADS: Readonly<Record<'sprite' | 'sheet' | 'tilemap' | 'palette', KindHead>> = {
  sprite: { key: MENU_KEYS.sprite, label: MENU_TEXT.sprite, icon: 'pixel-sprite' },
  sheet: { key: MENU_KEYS.sheet, label: MENU_TEXT.sheet, icon: 'pixel-grid-view' },
  tilemap: { key: MENU_KEYS.tilemap, label: MENU_TEXT.tilemap, icon: 'pixel-tileset' },
  palette: { key: MENU_KEYS.paletteAsset, label: MENU_TEXT.palette, icon: 'pixel-palette' },
};

export { KIND_HEADS };
