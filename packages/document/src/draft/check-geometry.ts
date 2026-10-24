/* @layer core @kind logic */
import { ERROR_CODE } from '../commands/error-code.constants';
import { fail } from '../commands/fail';
import type { Sprite } from '../model/sprite.type';
import { checkPivot } from '../validate/check-pivot';
import { checkSize } from '../validate/check-size';
import type { SpriteGeometry } from './resize-sprite.type';

const checkGeometry = (sprite: Sprite, geometry: SpriteGeometry): void => {
  checkSize(geometry);
  checkPivot(geometry.pivot, geometry);
  const expected = Object.keys(sprite.cels).sort();
  const given = Object.keys(geometry.cels).sort();
  if (expected.length !== given.length || expected.some((id, index) => id !== given[index])) {
    throw fail(ERROR_CODE.INVALID_OPTION, `Resizing sprite ${sprite.id} needs a buffer for each of its cels.`);
  }
  const area = geometry.width * geometry.height;
  if (Object.values(geometry.cels).some((pixels) => pixels.length !== area)) {
    throw fail(ERROR_CODE.INVALID_OPTION, `Every cel buffer of sprite ${sprite.id} is ${geometry.width} by ${geometry.height}.`);
  }
};

export { checkGeometry };
