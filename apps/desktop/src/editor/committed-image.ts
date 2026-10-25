/* @layer renderer-app @kind logic */
import { frameToRgba, patchFrameRgba } from '@bxel/document';
import { markDirty } from '../canvas-dirty/mark-dirty';
import { commitHandoff } from './commit-handoff';
import type { CommitHandoff } from './commit-handoff.type';
import type { Adopted } from './committed-image.type';
import type { EditorTarget } from './editor.type';
import { shownImage } from './shown-image';

const sameFrame = (first: EditorTarget, second: EditorTarget): boolean =>
  first.documentId === second.documentId && first.sprite.id === second.sprite.id && first.frameId === second.frameId;

const sameSize = (image: ImageData, target: EditorTarget): boolean =>
  image.width === target.sprite.width && image.height === target.sprite.height;

const continues = (handoff: CommitHandoff, target: EditorTarget, prior: EditorTarget | null): boolean =>
  prior !== null && sameFrame(prior, target) && prior.revision === handoff.from;

const fits = (handoff: CommitHandoff, target: EditorTarget, prior: EditorTarget | null): boolean =>
  handoff.to === target.revision && handoff.documentId === target.documentId && handoff.spriteId === target.sprite.id && handoff.frameId === target.frameId &&
  sameSize(handoff.image, target) && continues(handoff, target, prior);

const rebuilt = (target: EditorTarget): ImageData => {
  const { sprite, bank, frameId } = target;
  const rgba = frameToRgba(sprite, bank, frameId);
  return new ImageData(new Uint8ClampedArray(rgba.buffer, rgba.byteOffset, rgba.length), sprite.width, sprite.height);
};

const adopted = (handoff: CommitHandoff, target: EditorTarget): Adopted => {
  const { sprite, bank, frameId } = target;
  const { image, rect } = handoff;
  const changed = patchFrameRgba(sprite, bank, frameId, { rgba: image.data, rect });
  if (changed) markDirty(image.data, changed);
  commitHandoff.current = null;
  return { image, changed: changed !== null };
};

const committedImage = (target: EditorTarget): ImageData => {
  const { target: prior, image } = shownImage;
  if (prior && image && sameFrame(prior, target) && prior.revision === target.revision) {
    shownImage.target = target;
    return image;
  }
  const handoff = commitHandoff.current;
  const taken = handoff && fits(handoff, target, prior) ? adopted(handoff, target) : null;
  shownImage.target = target;
  shownImage.image = taken ? taken.image : rebuilt(target);
  shownImage.repaint = taken?.changed ?? false;
  return shownImage.image;
};

export { committedImage };
