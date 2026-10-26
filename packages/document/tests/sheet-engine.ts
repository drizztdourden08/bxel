/* @layer core @kind test */
import { counterIdSource, createEngine, documentCommands, legacyFrameCommands } from '@bxel/document';
import type { CommandStep, Engine, Sheet, SpriteId, TransactionOk } from '@bxel/document';
import { expect } from 'vitest';
import { canonicalArtwork } from './canonical-artwork';
import { brand, fixtureToArtwork } from './fixture-to-artwork';
import type { ArtworkFixture } from './fixture-to-artwork';
import { documentId, heartEngine, request } from './heart-engine';
import { heartPairFixture } from './heart-pair-fixture';

const HEART = brand<SpriteId>('spr_000010');
const HEART_B = brand<SpriteId>('spr_000020');
const SHEET = brand<Sheet['id']>('sht_000040');

const onSprites = (name: string, options: unknown, sprites: readonly (SpriteId | { ref: string })[], ref?: string): CommandStep => ({
  name,
  targets: { sprites: [...sprites], layers: { by: 'all' }, frames: { by: 'all' } },
  options,
  ...(ref === undefined ? {} : { ref }),
});

const plain = (name: string, options: unknown, ref?: string): CommandStep => ({
  name,
  targets: null,
  options,
  ...(ref === undefined ? {} : { ref }),
});

const apply = (engine: Engine, ...steps: CommandStep[]): TransactionOk => {
  const outcome = engine.execute(request(steps, { baseRevision: engine.state().revision, origin: 'ui' }));
  if (outcome.ok) return outcome;
  throw new Error(`${outcome.error.code}: ${outcome.error.message}`);
};

const engineAltered = (patch: Partial<ArtworkFixture>): Engine =>
  createEngine({
    state: { documentId, revision: 1, artwork: fixtureToArtwork({ ...heartPairFixture, ...patch }), readOnly: false },
    ids: counterIdSource(100),
    commands: [...documentCommands, ...legacyFrameCommands],
  });

const rejection = (engine: Engine, ...steps: CommandStep[]) => {
  const before = canonicalArtwork(engine.state().artwork);
  const revision = engine.state().revision;
  const result = engine.execute(request(steps, { baseRevision: revision }));
  expect(engine.state().revision).toBe(revision);
  expect(canonicalArtwork(engine.state().artwork)).toBe(before);
  if (result.ok) throw new Error('the request was accepted');
  return result.error;
};

const undo = (engine: Engine): void => {
  const result = engine.undo({ documentId: engine.state().documentId, expectedRevision: engine.state().revision });
  expect(result.ok).toBe(true);
};

const redo = (engine: Engine): void => {
  const result = engine.redo({ documentId: engine.state().documentId, expectedRevision: engine.state().revision });
  expect(result.ok).toBe(true);
};

const expectUndoRedo = (engine: Engine, ...steps: CommandStep[]): TransactionOk => {
  const before = canonicalArtwork(engine.state().artwork);
  const done = apply(engine, ...steps);
  const after = canonicalArtwork(engine.state().artwork);
  expect(after).not.toBe(before);
  undo(engine);
  expect(canonicalArtwork(engine.state().artwork)).toBe(before);
  redo(engine);
  expect(canonicalArtwork(engine.state().artwork)).toBe(after);
  return done;
};

const sheetOf = (engine: Engine, id = SHEET): Sheet => {
  const found = engine.state().artwork.sheets.find((sheet) => sheet.id === id);
  if (!found) throw new Error(`no sheet ${id}`);
  return found;
};

const spotsOf = (engine: Engine, id = SHEET): Record<string, string> =>
  Object.fromEntries(
    sheetOf(engine, id).entries.map((entry) => {
      const name = engine.state().artwork.sprites.find((sprite) => sprite.id === entry.spriteId)?.name ?? entry.spriteId;
      return [name, `${entry.at.x},${entry.at.y}`];
    }),
  );

const spriteNames = (engine: Engine): string[] => engine.state().artwork.sprites.map((sprite) => sprite.name);

const worldWithExtras = (): { engine: Engine; tiny: SpriteId; wide: SpriteId } => {
  const { engine } = heartEngine();
  const done = apply(
    engine,
    plain('sprite.create', { name: 'tiny', width: 4, height: 6 }, 'tiny'),
    plain('sprite.create', { name: 'wide', width: 20, height: 5 }, 'wide'),
  );
  return { engine, tiny: brand<SpriteId>(done.created['tiny'] ?? ''), wide: brand<SpriteId>(done.created['wide'] ?? '') };
};

export { HEART, HEART_B, SHEET, apply, engineAltered, expectUndoRedo, onSprites, plain, rejection, sheetOf, spotsOf, spriteNames, undo, worldWithExtras };
