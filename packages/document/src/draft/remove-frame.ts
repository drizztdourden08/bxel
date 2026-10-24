/* @layer core @kind logic */
import { dropUnusedCels } from '../artwork/drop-unused-cels';
import { ERROR_CODE } from '../commands/error-code.constants';
import { fail } from '../commands/fail';
import type { FrameId, SpriteId } from '../model/ids.type';
import type { Layer } from '../model/sprite.type';
import { requireSprite } from '../read/require-sprite';
import { addWarning } from './add-warning';
import type { Draft } from './draft.type';
import { FRAME_WARNING } from './frame-warning.constants';
import { shrinkTags } from './shrink-tags';
import { updateSprite } from './update-sprite';

const withoutFrame = (layer: Layer, frameId: FrameId): Layer => ({
  ...layer,
  cels: Object.fromEntries(Object.entries(layer.cels).filter(([key]) => key !== frameId)),
});

const removeFrame = (draft: Draft, spriteId: SpriteId, frameId: FrameId): void => {
  const sprite = requireSprite(draft.artwork, spriteId);
  if (!sprite.frames.some((frame) => frame.id === frameId)) {
    throw fail(ERROR_CODE.TARGET_NOT_FOUND, `Frame ${frameId} does not exist in sprite ${spriteId}.`);
  }
  const { tags, removed } = shrinkTags(sprite.tags, sprite.frames, frameId);
  const dropped = sprite.layers.flatMap((layer) => layer.cels[frameId] ?? []);
  updateSprite(draft, spriteId, (current) =>
    dropUnusedCels(
      {
        ...current,
        frames: current.frames.filter((frame) => frame.id !== frameId),
        layers: current.layers.map((layer) => withoutFrame(layer, frameId)),
        tags,
      },
      dropped,
    ),
  );
  for (const tag of removed) {
    addWarning(draft, FRAME_WARNING.TAG_REMOVED, `Tag "${tag.name}" covered only the deleted frame and was removed.`);
  }
};

export { removeFrame };
