/* @layer core @kind test */
import { sliceAsset } from '@bxel/document';
import type { Engine, Sprite } from '@bxel/document';
import { decodeSprite } from '@bxel/document/native';
import { encodeSlice } from './asset-bytes';
import { HEART } from './sheet-engine';

const savedHeart = (engine: Engine): Sprite | undefined => {
  const slice = sliceAsset(engine.state().artwork, { kind: 'sprite', id: HEART }, new Map());
  return decodeSprite(encodeSlice(slice)).slice?.artwork.sprites?.find((each) => each.id === HEART);
};

export { savedHeart };
