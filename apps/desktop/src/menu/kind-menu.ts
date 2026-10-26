/* @layer renderer-app @kind logic */
import type { MenuEntry, MenuItem } from '@drizztdourden08/brock-react';
import { ASSET_SETTINGS_COMMAND } from '../config-entry/config-entry.constants';
import type { EditorMenuState } from './editor-menu.type';
import { KIND_HEADS } from './kind-menu.constants';
import type { KindHead } from './kind-menu.type';
import { menuItem } from './menu-item';
import { paintItems } from './paint-items';
import { sheetItems } from './sheet-menu';
import { tilemapItems } from './tilemap-menu';

const joined = (items: readonly MenuEntry[], paint: readonly MenuEntry[]): MenuEntry[] => [...items, ...(paint.length > 0 ? ['separator' as const, ...paint] : [])];

const withSettings = (state: EditorMenuState, head: KindHead, items: readonly MenuEntry[]): MenuItem => ({
  ...head,
  children: [...items, ...(items.length > 0 ? ['separator' as const] : []), menuItem(ASSET_SETTINGS_COMMAND, state.settings)],
});

const spriteKind = (state: EditorMenuState): MenuItem => withSettings(state, state.kind === 'palette' ? KIND_HEADS.palette : KIND_HEADS.sprite, paintItems(state));

const sheetKind = (state: EditorMenuState): MenuItem => withSettings(state, KIND_HEADS.sheet, joined(sheetItems(state), paintItems(state)));

const tilemapKind = (state: EditorMenuState): MenuItem => withSettings(state, KIND_HEADS.tilemap, joined(tilemapItems(state), paintItems(state)));

const kindMenu = (state: EditorMenuState): MenuItem | null => {
  if (state.surface === 'none') return null;
  if (state.surface === 'sheet') return sheetKind(state);
  if (state.surface === 'map' || state.surface === 'tile') return tilemapKind(state);
  return state.isolated ? sheetKind(state) : spriteKind(state);
};

export { kindMenu };
