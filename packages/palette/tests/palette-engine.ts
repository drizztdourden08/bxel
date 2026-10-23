/* @layer tests @kind test */
import { counterIdSource, createEngine, documentCommands, projectCreate } from '@bxel/document';
import type {
  BankId,
  CommandStep,
  Engine,
  FrameId,
  PaletteBank,
  Project,
  Sprite,
  SpriteId,
  TransactionResult,
} from '@bxel/document';
import { paletteCommands } from '@bxel/palette';
import { expect } from 'vitest';

type Rig = { readonly engine: Engine; readonly spriteId: SpriteId; readonly bankId: BankId };

type RigOptions = { readonly transparent?: boolean; readonly cap?: number };

const colors = [
  { rgb: '#140b26', name: 'Night' },
  { rgb: '#4b1fa0', name: 'Deep Purple' },
  { rgb: '#7b3fe4', name: 'Violet' },
  { rgb: '#b02a9c', name: 'Magenta' },
];

const heroPixels = Uint8Array.from([0, 1, 2, 3, 4, 3, 2, 1, 1, 1, 2, 2, 0, 4, 4, 0]);

const step = (name: string, options: object): CommandStep => ({ name, targets: null, options });

const execute = (rig: Rig, steps: readonly CommandStep[]): TransactionResult =>
  rig.engine.execute({
    documentId: rig.engine.documentId,
    baseRevision: rig.engine.state().revision,
    mode: 'commit',
    origin: 'ui',
    label: 'Test edit',
    steps,
    previewPixels: 0,
  });

const succeed = (result: TransactionResult): TransactionResult => {
  if (!result.ok) throw new Error(`${result.error.code}: ${result.error.message}`);
  return result;
};

const makeRig = (rigOptions: RigOptions = {}): Rig => {
  const { transparent = true, cap = 8 } = rigOptions;
  const slotCount = colors.length + (transparent ? 1 : 0);
  const ids = counterIdSource();
  const created = projectCreate({
    options: {
      name: 'Palette tests',
      bank: { name: 'Test bank', cap, transparent, colors },
      sprite: { name: 'hero', width: 4, height: 4 },
    },
    ids,
  });
  if (!created.ok) throw new Error(created.error.message);
  const sprite = created.state.project.sprites[0];
  if (!sprite) throw new Error('the created project has no sprite');
  const engine = createEngine({ state: created.state, ids, commands: [...documentCommands, ...paletteCommands] });
  const rig: Rig = { engine, spriteId: sprite.id, bankId: sprite.bankId };
  succeed(
    execute(rig, [
      {
        name: 'pixels.patch',
        targets: { sprites: [sprite.id], layers: { by: 'all' }, frames: { by: 'all' } },
        options: { rect: { x: 0, y: 0, width: 4, height: 4 }, pixels: heroPixels.map((value) => Math.min(value, slotCount - 1)) },
      },
    ]),
  );
  return rig;
};

const currentBank = (rig: Rig): PaletteBank => {
  const bank = rig.engine.state().project.banks.find((candidate) => candidate.id === rig.bankId);
  if (!bank) throw new Error('the bank is missing');
  return bank;
};

const currentSprite = (rig: Rig): Sprite => {
  const sprite = rig.engine.state().project.sprites.find((candidate) => candidate.id === rig.spriteId);
  if (!sprite) throw new Error('the sprite is missing');
  return sprite;
};

const firstFrame = (sprite: Sprite): FrameId => {
  const frame = sprite.frames[0];
  if (!frame) throw new Error('the sprite has no frame');
  return frame.id;
};

const celBytes = (sprite: Sprite): number[] => Object.values(sprite.cels).flatMap((cel) => Array.from(cel.pixels));

const snapshotProject = (project: Project): string =>
  JSON.stringify(project, (_key, value: unknown) => (value instanceof Uint8Array ? Buffer.from(value).toString('hex') : value));

const rejectionCode = (rig: Rig, run: () => TransactionResult): string | null => {
  const revision = rig.engine.state().revision;
  const snapshot = snapshotProject(rig.engine.state().project);
  const result = run();
  expect(rig.engine.state().revision).toBe(revision);
  expect(snapshotProject(rig.engine.state().project)).toBe(snapshot);
  return result.ok ? null : result.error.code;
};

const slotId = (rig: Rig, index: number): string => {
  const slot = currentBank(rig).slots[index];
  if (!slot) throw new Error(`slot ${index} is missing`);
  return slot.id;
};

export {
  celBytes,
  currentBank,
  currentSprite,
  execute,
  firstFrame,
  makeRig,
  rejectionCode,
  slotId,
  snapshotProject,
  step,
  succeed,
};
export type { Rig };
