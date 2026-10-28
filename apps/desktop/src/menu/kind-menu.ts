/* @layer renderer-app @kind logic */
import type { MenuEntry, MenuItem } from '@drizztdourden08/brock-react';
import { ASSET_SETTINGS_COMMAND } from '../config-entry/config-entry.constants';
import { evaluate } from '../ui-context/evaluate';
import { animationItems } from './animation-menu';
import type { EditorMenuState } from './editor-menu.type';
import { KIND_HEADS } from './kind-menu.constants';
import { menuItem } from './menu-item';
import { paintItems } from './paint-items';
import { ruledItem } from './ruled-item';
import { sheetItems } from './sheet-menu';
import { tidyMenu } from './tidy-menu';
import { tilemapItems } from './tilemap-menu';

const joined = (items: readonly MenuEntry[], paint: readonly MenuEntry[]): MenuEntry[] => tidyMenu([...items, 'separator', ...paint]);

const bodyOf = (state: EditorMenuState): MenuEntry[] => {
  const { context } = state;
  const paint = paintItems(state);
  if (context.fileType === 'sprite') return joined(tidyMenu([ruledItem(context, 'sprite.make_animation', 'Make an animation...')]), paint);
  if (context.fileType === 'animation') return joined(animationItems(state), paint);
  if (context.fileType === 'palette') return paint;
  if (context.fileType === 'sheet') return joined(sheetItems(state), paint);
  if (context.fileType === 'tileset' || context.fileType === 'tilemap') return joined(tilemapItems(state), paint);
  return tidyMenu([ruledItem(context, 'image.import', 'Import...')]);
};

const kindMenu = (state: EditorMenuState): MenuItem | null => {
  const { fileType } = state.context;
  if (fileType === 'none' || evaluate(`menu.kind.${fileType}`, state.context).state === 'hidden') return null;
  const items = bodyOf(state);
  const settings = fileType === 'image' ? [] : [menuItem(ASSET_SETTINGS_COMMAND, state.settings)];
  const children = tidyMenu([...items, ...(items.length > 0 && settings.length > 0 ? ['separator' as const] : []), ...settings]);
  return children.length === 0 ? null : { ...KIND_HEADS[fileType], children };
};

export { kindMenu };
