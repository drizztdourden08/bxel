/* @layer renderer-app @kind logic */
import type { Rect, SpriteId } from '@bxel/document';
import type { BandBox } from './manager.type';

const touches = (a: Rect, b: Rect): boolean =>
  a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;

const bandIds = (boxes: readonly BandBox[], band: Rect): SpriteId[] => boxes.filter((box) => touches(box, band)).map((box) => box.id);

export { bandIds };
