/* @layer renderer-app @kind logic */
import type { SpriteId } from '@bxel/document';
import type { AssetFocus } from '../asset-config/asset-config.type';
import { flipSprites } from '../sheet-manager/flip-sprites';
import { turnSprites } from '../sheet-manager/turn-sprites';
import type { SpriteMove } from './asset-overview.type';

const moveFocused = (focus: AssetFocus, move: SpriteMove): void => {
  if (focus.readOnly || focus.key.kind !== 'sprite') return;
  const ids = [focus.key.id as SpriteId];
  if (move.flip) flipSprites(ids, move.flip);
  else if (move.turn) turnSprites(ids, move.turn);
};

export { moveFocused };
