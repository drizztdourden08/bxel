/* @layer renderer-app @kind constants */
import type { FileType } from '../ui-context/bxel-context.type';
import { MENU_KEYS, MENU_TEXT } from './editor-menu.constants';
import type { KindHead } from './kind-menu.type';

const KIND_HEADS: Readonly<Record<Exclude<FileType, 'none'>, KindHead>> = {
  sprite: { key: MENU_KEYS.sprite, label: MENU_TEXT.sprite, icon: 'pixel-sprite' },
  animation: { key: MENU_KEYS.animation, label: MENU_TEXT.animation, icon: 'pixel-animation' },
  sheet: { key: MENU_KEYS.sheet, label: MENU_TEXT.sheet, icon: 'pixel-grid-view' },
  tileset: { key: MENU_KEYS.tileset, label: MENU_TEXT.tileset, icon: 'pixel-tileset' },
  tilemap: { key: MENU_KEYS.tilemap, label: MENU_TEXT.tilemap, icon: 'pixel-tilemap' },
  palette: { key: MENU_KEYS.paletteAsset, label: MENU_TEXT.palette, icon: 'pixel-palette' },
  image: { key: MENU_KEYS.image, label: MENU_TEXT.image, icon: 'image' },
};

export { KIND_HEADS };
