/* @layer renderer-app @kind logic */
import type { SpriteState } from '../stores/sprite-store.type';
import { pickTab } from './pick-tab';

const followSpritePick = (state: SpriteState, previous: SpriteState): void => {
  if (state.mode !== 'sprite' || state.activeId === null || state.activeId === previous.activeId) return;
  pickTab({ kind: 'sprite', id: state.activeId });
};

export { followSpritePick };
