/* @layer renderer-app @kind logic */
import type { MenuEntry } from '@drizztdourden08/brock-react';
import { evaluate } from '../ui-context/evaluate';
import type { EditorMenuState } from './editor-menu.type';
import { layerMenu } from './layer-menu';
import { paletteMenu } from './palette-menu';

const paintItems = (state: EditorMenuState): MenuEntry[] => {
  const { context } = state;
  if (context.fileType === 'palette') return paletteMenu(state).children ?? [];
  const layer = evaluate('menu.layer', context).state === 'hidden' ? [] : [layerMenu(state)];
  const palette = evaluate('menu.palette', context).state === 'hidden' ? [] : [paletteMenu(state)];
  return [...layer, ...palette];
};

export { paintItems };
