/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep, SpriteId, TargetScope } from '@bxel/document';
import { gridOf } from './grid-of';
import type { SpriteSize, SpriteStepsInput } from './new-sprite.type';

const refOf = (index: number): string => `new${index}`;

const scopeOf = (input: SpriteStepsInput, index: number): TargetScope => ({
  sprites: [index === 0 && input.existingId !== null ? (input.existingId as SpriteId) : { ref: refOf(index) }],
  layers: { by: 'all' },
  frames: { by: 'all' },
});

const gridOption = (input: SpriteStepsInput): { pixelGrid?: SpriteSize } => {
  const pixelGrid = gridOf(input.pixelGrid);
  return pixelGrid === null ? {} : { pixelGrid };
};

const gridStep = (input: SpriteStepsInput): CommandStep[] =>
  input.existingId === null || gridOf(input.pixelGrid) === null
    ? []
    : [{ name: COMMAND_NAME.spriteUpdate, targets: scopeOf(input, 0), options: gridOption(input) }];

const createStep = (input: SpriteStepsInput, name: string, index: number): CommandStep => ({
  name: COMMAND_NAME.spriteCreate,
  targets: null,
  options: { name, ...input.size, ...(input.bankId === null ? {} : { bankId: input.bankId }), ...gridOption(input) },
  ref: refOf(index),
});

const fillStep = (input: SpriteStepsInput, slot: number, index: number): CommandStep => ({
  name: COMMAND_NAME.pixelsFill,
  targets: scopeOf(input, index),
  options: { x: 0, y: 0, index: slot, mode: 'contiguous', connectivity: 4 },
});

const spriteSteps = (input: SpriteStepsInput): CommandStep[] => [
  ...gridStep(input),
  ...input.names.flatMap((name, index) => {
    const created = index === 0 && input.existingId !== null ? [] : [createStep(input, name, index)];
    return input.fillSlot === null ? created : [...created, fillStep(input, input.fillSlot, index)];
  }),
];

export { spriteSteps };
