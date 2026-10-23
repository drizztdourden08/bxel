/* @layer core @kind logic */
import type { Rect } from '../../model/geometry.type';
import type { SpriteId } from '../../model/ids.type';
import { MAX_PATCH_PIXELS } from '../../model/limits.constants';
import type { Project } from '../../model/project.type';
import type { Sprite } from '../../model/sprite.type';
import { maxIndex } from '../../pixels/max-index';
import { requireBank } from '../../read/require-bank';
import { requireSprite } from '../../read/require-sprite';
import type { PixelsPatchOptions } from '../../schema/command-options.type';
import type { TargetIssue } from '../command-error.type';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';

const fits = (rect: Rect, sprite: Sprite): boolean =>
  rect.x >= 0 && rect.y >= 0 && rect.x + rect.width <= sprite.width && rect.y + rect.height <= sprite.height;

const issue = (spriteId: SpriteId, reason: string): TargetIssue => ({ spriteId, layerId: null, frameId: null, reason });

const checkPatch = (project: Project, options: PixelsPatchOptions, sprites: readonly SpriteId[]): void => {
  const { rect, pixels } = options;
  const area = rect.width * rect.height;
  if (area > MAX_PATCH_PIXELS) throw fail(ERROR_CODE.BATCH_TOO_LARGE, `A patch holds at most ${MAX_PATCH_PIXELS} pixels.`);
  if (pixels.length !== area) {
    throw fail(ERROR_CODE.INVALID_OPTION, 'pixels must hold rect.width * rect.height bytes.', { path: 'options.pixels' });
  }
  const highest = maxIndex(pixels);
  const outside: TargetIssue[] = [];
  const tooHigh: TargetIssue[] = [];
  for (const spriteId of sprites) {
    const sprite = requireSprite(project, spriteId);
    if (!fits(rect, sprite)) outside.push(issue(spriteId, 'the rect leaves the sprite'));
    if (highest >= requireBank(project, sprite.bankId).slots.length) tooHigh.push(issue(spriteId, 'a pixel index is past the last slot'));
  }
  if (outside.length > 0) throw fail(ERROR_CODE.OUT_OF_BOUNDS, 'The rect must lie inside every target sprite.', { details: outside });
  if (tooHigh.length > 0) throw fail(ERROR_CODE.INDEX_OUT_OF_RANGE, 'A pixel index is at or above the palette size.', { details: tooHigh });
};

export { checkPatch };
