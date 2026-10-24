/* @layer tests @kind helper */
import { frameToRgba } from '@bxel/document';
import type { BankId, CommandStep, PaletteBank, SpriteId, TransactionOk } from '@bxel/document';
import { expect } from 'vitest';
import { currentSprite, execute, firstFrame, snapshotProject, step, succeed } from './palette-engine';
import type { Rig } from './palette-engine';

const request = (rig: Rig, steps: readonly CommandStep[], mode: 'preview' | 'commit') => ({
  documentId: rig.engine.documentId,
  baseRevision: rig.engine.state().revision,
  mode,
  origin: 'ui' as const,
  label: 'Test edit',
  steps,
  previewPixels: 4096,
});

const undoOnce = (rig: Rig) => rig.engine.undo({ documentId: rig.engine.documentId, expectedRevision: rig.engine.state().revision });

const redoOnce = (rig: Rig) => rig.engine.redo({ documentId: rig.engine.documentId, expectedRevision: rig.engine.state().revision });

const roundTrip = (rig: Rig, steps: readonly CommandStep[]): TransactionOk => {
  const before = snapshotProject(rig.engine.state().project);
  const result = succeed(execute(rig, steps));
  const after = snapshotProject(rig.engine.state().project);
  expect(after).not.toBe(before);
  expect(undoOnce(rig).ok).toBe(true);
  expect(snapshotProject(rig.engine.state().project)).toBe(before);
  expect(redoOnce(rig).ok).toBe(true);
  expect(snapshotProject(rig.engine.state().project)).toBe(after);
  if (!result.ok) throw new Error('unreachable');
  return result;
};

const previewMatchesCommit = (rig: Rig, steps: readonly CommandStep[]): void => {
  const revision = rig.engine.state().revision;
  const before = snapshotProject(rig.engine.state().project);
  const preview = rig.engine.execute(request(rig, steps, 'preview'));
  expect(rig.engine.state().revision).toBe(revision);
  expect(snapshotProject(rig.engine.state().project)).toBe(before);
  const commit = rig.engine.execute(request(rig, steps, 'commit'));
  if (!preview.ok || !commit.ok) throw new Error('the preview or the commit failed');
  expect(JSON.stringify(preview.changes)).toBe(JSON.stringify(commit.changes));
  expect(preview.created).toEqual(commit.created);
  expect(preview.warnings).toEqual(commit.warnings);
};

const rgbaOfSprite = (rig: Rig, spriteId: SpriteId): number[] => {
  const project = rig.engine.state().project;
  const sprite = project.sprites.find((candidate) => candidate.id === spriteId);
  const bank = project.banks.find((candidate) => candidate.id === sprite?.bankId);
  if (!sprite || !bank) throw new Error('the sprite or its bank is missing');
  return Array.from(frameToRgba(sprite, bank, firstFrame(sprite)));
};

const heroRgba = (rig: Rig): number[] => rgbaOfSprite(rig, currentSprite(rig).id);

const addSprite = (rig: Rig, name: string, bankId: BankId, pixels: readonly number[]): SpriteId => {
  const result = succeed(
    execute(rig, [
      { ...step('sprite.create', { name, width: 4, height: 4, bankId }), ref: 'extra' },
      {
        name: 'pixels.patch',
        targets: { sprites: [{ ref: 'extra' }], layers: { by: 'all' }, frames: { by: 'all' } },
        options: { rect: { x: 0, y: 0, width: 4, height: 4 }, pixels: Uint8Array.from(pixels) },
      },
    ]),
  );
  return (result.ok ? result.created.extra : '') as SpriteId;
};

const onSprites = (command: CommandStep, spriteIds: readonly SpriteId[]): CommandStep => ({
  ...command,
  targets: { sprites: [...spriteIds], layers: { by: 'all' }, frames: { by: 'all' } },
});

const bankOf = (rig: Rig, bankId: BankId): PaletteBank => {
  const bank = rig.engine.state().project.banks.find((candidate) => candidate.id === bankId);
  if (!bank) throw new Error('the bank is missing');
  return bank;
};

const spriteOf = (rig: Rig, spriteId: SpriteId) => {
  const sprite = rig.engine.state().project.sprites.find((candidate) => candidate.id === spriteId);
  if (!sprite) throw new Error('the sprite is missing');
  return sprite;
};

const flatIndices = (rig: Rig, spriteId: SpriteId): number[] => {
  const sprite = spriteOf(rig, spriteId);
  return Object.values(sprite.cels).flatMap((cel) => Array.from(cel.pixels));
};

export { addSprite, bankOf, flatIndices, heroRgba, onSprites, previewMatchesCommit, rgbaOfSprite, roundTrip, spriteOf };
