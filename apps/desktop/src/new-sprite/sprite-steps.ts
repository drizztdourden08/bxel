/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep, SpriteId, TargetScope } from '@bxel/document';
import type { SpriteStepsInput } from './new-sprite.type';

const refOf = (index: number): string => `new${index}`;

const scopeOf = (input: SpriteStepsInput, index: number): TargetScope => ({
  sprites: [index === 0 && input.existingId !== null ? (input.existingId as SpriteId) : { ref: refOf(index) }],
  layers: { by: 'all' },
  frames: { by: 'all' },
});

const createStep = (input: SpriteStepsInput, name: string, index: number): CommandStep => ({
  name: COMMAND_NAME.spriteCreate,
  targets: null,
  options: { name, ...input.size, ...(input.bankId === null ? {} : { bankId: input.bankId }) },
  ref: refOf(index),
});

const fillStep = (input: SpriteStepsInput, slot: number, index: number): CommandStep => ({
  name: COMMAND_NAME.pixelsFill,
  targets: scopeOf(input, index),
  options: { x: 0, y: 0, index: slot, mode: 'contiguous', connectivity: 4 },
});

const spriteSteps = (input: SpriteStepsInput): CommandStep[] =>
  input.names.flatMap((name, index) => {
    const created = index === 0 && input.existingId !== null ? [] : [createStep(input, name, index)];
    return input.fillSlot === null ? created : [...created, fillStep(input, input.fillSlot, index)];
  });

export { spriteSteps };
