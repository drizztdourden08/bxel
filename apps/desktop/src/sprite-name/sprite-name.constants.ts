/* @layer renderer-app @kind constants */
import { MAX_SPRITE_SIZE, MIN_SPRITE_SIZE } from '@bxel/document';

const SIZE_RANGE = { min: MIN_SPRITE_SIZE, max: MAX_SPRITE_SIZE } as const;

const NAME_TEXT = {
  invalid: 'A name has 1 to 64 characters you can print.',
  taken: (name: string): string => `Name ${name} is already used. Choose another name.`,
  size: `Size must be between ${MIN_SPRITE_SIZE} and ${MAX_SPRITE_SIZE} pixels.`,
} as const;

const DEFAULT_SPRITE_NAME = 'sprite';

export { DEFAULT_SPRITE_NAME, NAME_TEXT, SIZE_RANGE };
