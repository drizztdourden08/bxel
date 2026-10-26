/* @layer renderer-app @kind logic */
import type { MenuEntry } from '@drizztdourden08/brock-react';
import { SHEET_COMMAND } from '../keymap/sheet-command-id.constants';
import { hasPart } from '../surface/has-part';
import type { EditorMenuState } from './editor-menu.type';
import { layerMenu } from './layer-menu';
import { menuItem } from './menu-item';
import { paletteMenu } from './palette-menu';

const paintItems = (state: EditorMenuState): MenuEntry[] => {
  if (!hasPart(state.surface, 'paint')) return [];
  if (state.kind === 'palette') return paletteMenu(state).children ?? [];
  return [layerMenu(state), paletteMenu(state), menuItem(SHEET_COMMAND.duplicateFrame, 'Duplicate frame')];
};

export { paintItems };
