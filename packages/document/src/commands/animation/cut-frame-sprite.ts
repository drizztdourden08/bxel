/* @layer core @kind logic */
import { addSprite } from '../../draft/add-sprite';
import type { Draft } from '../../draft/draft.type';
import type { Rect } from '../../model/geometry.type';
import type { CelId } from '../../model/ids.type';
import type { Sprite } from '../../model/sprite.type';
import { readRect } from '../../pixels/read-rect';
import { flattenFrame } from '../../read/flatten-frame';
import { freeName } from '../layer/free-name';
import { buildSprite } from '../sprite/build-sprite';
import { SPLIT_SPRITE_NAME } from './animation.constants';

const withPixels = (draft: Draft, base: Sprite, pixels: Uint8Array): Sprite => {
  const frame = base.frames[0];
  const layer = base.layers[0];
  if (!frame || !layer || !pixels.some((value) => value !== 0)) return base;
  const id = draft.ids.next('cel') as CelId;
  return { ...base, layers: [{ ...layer, cels: { [frame.id]: id } }], cels: { [id]: { id, pixels } } };
};

const cutFrameSprite = (draft: Draft, owner: string, source: Sprite, clip: Rect): Sprite => {
  const first = source.frames[0];
  const pixels = first ? readRect(flattenFrame(source, first.id), source.width, clip) : new Uint8Array(clip.width * clip.height);
  const taken = draft.artwork.sprites.map((sprite) => sprite.name);
  const name = freeName(taken, `${owner}${SPLIT_SPRITE_NAME}`);
  const base = buildSprite({ ids: draft.ids, name, width: clip.width, height: clip.height, bankId: source.bankId, pivot: null, created: draft.stamp });
  const sprite = withPixels(draft, base, pixels);
  addSprite(draft, sprite);
  return sprite;
};

export { cutFrameSprite };
