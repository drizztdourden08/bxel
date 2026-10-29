/* @layer renderer-app @kind logic */
import { MAX_SPRITE_SIZE } from '@bxel/document';
import { DROP_TEXT } from './image-drop.constants';
import type { DropPlan, DropSize } from './image-drop.type';

const stripCellsOf = (image: DropSize, frame: DropSize): number => (image.height === frame.height && image.width % frame.width === 0 ? image.width / frame.width : 0);

const planImageDrop = (image: DropSize, frame: DropSize): DropPlan => {
  if (image.width === frame.width && image.height === frame.height) return { kind: 'frame' };
  const cells = stripCellsOf(image, frame);
  if (cells < 2) return { kind: 'refuse', reason: DROP_TEXT.size(image.width, image.height, frame.width, frame.height) };
  if (image.width > MAX_SPRITE_SIZE) return { kind: 'refuse', reason: DROP_TEXT.tooLarge(image.width, image.height) };
  return { kind: 'strip', cells };
};

export { planImageDrop };
