/* @layer core @kind logic */
import type { Draft } from './draft.type';
import { NO_COPY } from './frame-copy.constants';
import type { InsertFrameInput } from './insert-frame.type';
import { planFrameCopy } from './plan-frame-copy';
import { updateSprite } from './update-sprite';

const insertFrame = (draft: Draft, input: InsertFrameInput): void => {
  const { spriteId, frame, at, copyOf, linked = false } = input;
  updateSprite(draft, spriteId, (sprite) => {
    const copy = copyOf ? planFrameCopy(draft.ids, sprite, copyOf, linked) : NO_COPY;
    return {
      ...sprite,
      frames: [...sprite.frames.slice(0, at), frame, ...sprite.frames.slice(at)],
      layers: sprite.layers.map((layer) => {
        const celId = copy.links.get(layer.id);
        return celId ? { ...layer, cels: { ...layer.cels, [frame.id]: celId } } : layer;
      }),
      cels: { ...sprite.cels, ...copy.cels },
    };
  });
};

export { insertFrame };
