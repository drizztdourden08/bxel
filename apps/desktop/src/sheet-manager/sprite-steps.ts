/* @layer renderer-app @kind logic */
import { MAX_TARGET_SPRITES } from '@bxel/document';
import type { CommandStep, SpriteId } from '@bxel/document';
import { spritesTarget } from '../sheet/sprites-target';

const spriteSteps = (name: string, ids: readonly SpriteId[], options: unknown): CommandStep[] =>
  Array.from({ length: Math.ceil(ids.length / MAX_TARGET_SPRITES) }, (_, chunk) => ({
    name,
    targets: spritesTarget(ids.slice(chunk * MAX_TARGET_SPRITES, (chunk + 1) * MAX_TARGET_SPRITES)),
    options,
  }));

export { spriteSteps };
