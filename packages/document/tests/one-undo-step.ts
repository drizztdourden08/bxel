/* @layer core @kind test */
import type { Engine } from '@bxel/document';
import { expect } from 'vitest';
import { canonicalArtwork } from './canonical-artwork';

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

export { checkOneUndoStep };
