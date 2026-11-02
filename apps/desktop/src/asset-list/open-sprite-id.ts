/* @layer renderer-app @kind logic */
import type { SpriteId } from '@bxel/document';
import { currentTab } from '../workspace/current-tab';

const openSpriteId = (): SpriteId | null => {
  const key = currentTab()?.key;
  return key?.kind === 'sprite' ? (key.id as SpriteId) : null;
};

export { openSpriteId };
