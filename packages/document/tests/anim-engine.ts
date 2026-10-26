/* @layer core @kind test */
import { artworkCreate, counterIdSource, createEngine, documentCommands } from '@bxel/document';
import type {
  Animation,
  AnimationId,
  BankId,
  CommandError,
  CommandStep,
  Engine,
  PaletteBank,
  SpriteId,
  TransactionOk,
  TransactionResult,
} from '@bxel/document';
import { expect } from 'vitest';
import { canonicalArtwork } from './canonical-artwork';
import { patch, spriteStep, step } from './tile-engine';

type AnimWorld = {
  readonly engine: Engine;
  readonly a: SpriteId;
  readonly b: SpriteId;
  readonly c: SpriteId;
  readonly strip: SpriteId;
  readonly other: SpriteId;
  readonly otherBank: BankId;
};

const COLORS = Array.from({ length: 15 }, (_, index) => ({ rgb: `#${(index + 1).toString(16).repeat(6)}` }));

const GRID = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
const SOLID = (value: number): number[] => Array.from({ length: 16 }, () => value);
const STRIP = Array.from({ length: 64 }, (_, index) => Math.floor((index % 16) / 4) + 1);

const send = (engine: Engine, steps: readonly CommandStep[], mode: 'commit' | 'preview' = 'commit'): TransactionResult =>
  engine.execute({
    documentId: engine.documentId,
    baseRevision: engine.state().revision,
    mode,
    origin: 'mcp',
    label: 'Test edit',
    steps,
    previewPixels: 0,
  });

const apply = (engine: Engine, steps: readonly CommandStep[]): TransactionOk => {
  const result = send(engine, steps);
  if (!result.ok) throw new Error(`${result.error.code}: ${result.error.message}`);
  return result;
};

const refuse = (engine: Engine, steps: readonly CommandStep[]): CommandError => {
  const result = send(engine, steps);
  if (result.ok) throw new Error('the request was accepted');
  return result.error;
};

const otherBankOf = (bank: PaletteBank): PaletteBank => ({ ...bank, id: 'bnk_000099' as BankId, name: 'Other' });

const buildAnimWorld = (): AnimWorld => {
  const created = artworkCreate({
    options: { name: 'Fresh', bank: { name: 'Bxel', cap: 16, transparent: true, colors: COLORS }, sprite: { name: 'hero', width: 4, height: 4 } },
    ids: counterIdSource(),
  });
  if (!created.ok) throw new Error('the fixture did not build');
  const { artwork } = created.state;
  const first = artwork.banks[0];
  if (!first) throw new Error('the fixture has no palette');
  const second = otherBankOf(first);
  const engine = createEngine({
    state: { ...created.state, artwork: { ...artwork, banks: [first, second] } },
    ids: counterIdSource(500),
    commands: documentCommands,
  });
  const done = apply(engine, [
    step('sprite.create', { name: 'a', width: 4, height: 4 }, 'a'),
    step('sprite.create', { name: 'b', width: 4, height: 4 }, 'b'),
    step('sprite.create', { name: 'c', width: 4, height: 4 }, 'c'),
    step('sprite.create', { name: 'strip', width: 16, height: 4 }, 'strip'),
    step('sprite.create', { name: 'other', width: 4, height: 4, bankId: second.id }, 'other'),
    spriteStep('pixels.patch', patch(4, GRID), 'a'),
    spriteStep('pixels.patch', patch(4, SOLID(2)), 'b'),
    spriteStep('pixels.patch', patch(4, SOLID(3)), 'c'),
    spriteStep('pixels.patch', patch(16, STRIP), 'strip'),
  ]);
  const id = (ref: string): SpriteId => done.created[ref] as SpriteId;
  return { engine, a: id('a'), b: id('b'), c: id('c'), strip: id('strip'), other: id('other'), otherBank: second.id };
};

const animationNamed = (engine: Engine, name: string): Animation => {
  const found = engine.state().artwork.animations.find((animation) => animation.name === name);
  if (!found) throw new Error(`no animation ${name}`);
  return found;
};

const createdAnimation = (engine: Engine, steps: readonly CommandStep[]): AnimationId =>
  apply(engine, steps).created['anim'] as AnimationId;

const checkOneUndoStep = (engine: Engine, edit: () => void): void => {
  const before = canonicalArtwork(engine.state().artwork);
  const revision = engine.state().revision;
  edit();
  expect(engine.state().revision).toBe(revision + 1);
  const after = canonicalArtwork(engine.state().artwork);
  expect(after).not.toBe(before);
  const ask = () => ({ documentId: engine.documentId, expectedRevision: engine.state().revision });
  expect(engine.undo(ask()).ok).toBe(true);
  expect(canonicalArtwork(engine.state().artwork)).toBe(before);
  expect(engine.redo(ask()).ok).toBe(true);
  expect(canonicalArtwork(engine.state().artwork)).toBe(after);
};

export type { AnimWorld };
export { animationNamed, apply, buildAnimWorld, checkOneUndoStep, createdAnimation, refuse, send };
