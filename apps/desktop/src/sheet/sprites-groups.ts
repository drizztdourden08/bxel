/* @layer renderer-app @kind logic */
import type { MenuGroup } from '@drizztdourden08/tessera';
import type { SpritesScope } from '../stores/sprite-store.type';
import { radioItem } from './radio-item';
import { SHEET_TEXT } from './sheet.constants';

const spritesGroups = (current: SpritesScope, pick: (value: SpritesScope) => void): MenuGroup[] => [
  {
    id: 'sprites',
    items: [radioItem('current', SHEET_TEXT.currentSprite, current, pick), radioItem('selected', SHEET_TEXT.selectedSprites, current, pick)],
  },
];

export { spritesGroups };
