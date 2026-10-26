/* @layer core @kind test */
import { counterIdSource, createEngine, documentCommands, legacyFrameCommands } from '@bxel/document';
import type {
  CommandStep,
  Engine,
  Layer,
  Sprite,
  SpriteId,
  TransactionOk,
  TransactionResult,
} from '@bxel/document';
import { expect } from 'vitest';
import { canonicalArtwork } from './canonical-artwork';
import { brand, fixtureToArtwork } from './fixture-to-artwork';
import { documentId, request } from './heart-engine';
import { layerFixture } from './layer-fixture';

const MUSHROOM = brand<SpriteId>('spr_000100');
const MUSHROOM_B = brand<SpriteId>('spr_000200');
const LONELY = brand<SpriteId>('spr_000300');

const layerEngine = (): Engine =>
  createEngine({
    state: { documentId, revision: 1, artwork: fixtureToArtwork(layerFixture), readOnly: false },
    ids: counterIdSource(500),
    commands: [...documentCommands, ...legacyFrameCommands],
  });

const layerStep = (name: string, options: unknown, sprites: readonly SpriteId[] = [MUSHROOM], ref?: string): CommandStep => ({
  name,
  targets: { sprites, layers: { by: 'all' }, frames: { by: 'all' } },
  options,
  ...(ref === undefined ? {} : { ref }),
});

const named = (name: string) => ({ by: 'name', name }) as const;

const apply = (engine: Engine, step: CommandStep): TransactionOk => {
  const result = engine.execute(request([step], { baseRevision: engine.state().revision, origin: 'ui' }));
  if (!result.ok) throw new Error(`${result.error.code}: ${result.error.message}`);
  return result;
};

const rejection = (engine: Engine, step: CommandStep) => {
  const before = canonicalArtwork(engine.state().artwork);
  const revision = engine.state().revision;
  const undoable = engine.canUndo();
  const result: TransactionResult = engine.execute(request([step], { baseRevision: revision }));
  expect(engine.state().revision).toBe(revision);
  expect(canonicalArtwork(engine.state().artwork)).toBe(before);
  expect(engine.canUndo()).toBe(undoable);
  if (result.ok) throw new Error('the request was accepted');
  return result.error;
};

const sprite = (engine: Engine, id: SpriteId = MUSHROOM): Sprite => {
  const found = engine.state().artwork.sprites.find((item) => item.id === id);
  if (!found) throw new Error(`no sprite ${id}`);
  return found;
};

const celPixels = (engine: Engine, celId: string | undefined, id: SpriteId = MUSHROOM): Uint8Array | undefined =>
  Object.values(sprite(engine, id).cels).find((cel) => cel.id === celId)?.pixels;

const layerNames =(engine: Engine, id: SpriteId = MUSHROOM): string[] => sprite(engine, id).layers.map((layer) => layer.name);

const layerOf = (engine: Engine, name: string, id: SpriteId = MUSHROOM): Layer => {
  const found = sprite(engine, id).layers.find((layer) => layer.name === name);
  if (!found) throw new Error(`no layer ${name}`);
  return found;
};

const undoRequest = (engine: Engine) => ({ documentId, expectedRevision: engine.state().revision });

const expectUndoRedo = (engine: Engine, step: CommandStep): void => {
  const before = canonicalArtwork(engine.state().artwork);
  const undoable = engine.canUndo();
  apply(engine, step);
  const after = canonicalArtwork(engine.state().artwork);
  expect(after).not.toBe(before);
  expect(engine.undo(undoRequest(engine)).ok).toBe(true);
  expect(canonicalArtwork(engine.state().artwork)).toBe(before);
  expect(engine.canUndo()).toBe(undoable);
  expect(engine.redo(undoRequest(engine)).ok).toBe(true);
  expect(canonicalArtwork(engine.state().artwork)).toBe(after);
};

export { LONELY, MUSHROOM, MUSHROOM_B, apply, celPixels, expectUndoRedo, layerEngine, layerNames, layerOf, layerStep, named, rejection, sprite };
