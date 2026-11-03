/* @layer renderer-app @kind logic */
import { COMMAND_NAME, MAX_TARGET_SPRITES } from '@bxel/document';
import type { CommandStep } from '@bxel/document';
import { SPRITE_REF } from './image-import.constants';

const spriteRef = (index: number): string => `${SPRITE_REF}-${index}`;

const sheetAddSteps = (sheetId: string, count: number): CommandStep[] =>
  Array.from({ length: Math.ceil(count / MAX_TARGET_SPRITES) }, (_unused, chunk) => {
    const from = chunk * MAX_TARGET_SPRITES;
    const size = Math.min(MAX_TARGET_SPRITES, count - from);
    return {
      name: COMMAND_NAME.sheetAdd,
      targets: {
        sprites: Array.from({ length: size }, (_each, offset) => ({ ref: spriteRef(from + offset) })),
        layers: { by: 'all' },
        frames: { by: 'all' },
      },
      options: { sheet: sheetId },
    };
  });

export { sheetAddSteps, spriteRef };
