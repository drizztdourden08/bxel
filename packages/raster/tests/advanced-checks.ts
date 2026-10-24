/* @layer tests @kind logic */
import { readRect } from '@bxel/document';
import type { CommandStep, Engine, PreviewCel, Artwork, TransactionOk } from '@bxel/document';
import { expect } from 'vitest';
import { documentId, pixelEngine, request } from './pixel-engine';
import { expectUntouched, okOf } from './result-checks';

const expectOneUndo = (engine: Engine, original: Artwork): void => {
  okOf(engine.undo({ documentId, expectedRevision: 2 }));
  expect(engine.state().artwork).toEqual(original);
  expect(engine.canUndo()).toBe(false);
};

const committedRect = (artwork: Artwork, cel: PreviewCel): number[] => {
  const sprite = artwork.sprites.find((item) => item.cels[cel.celId]);
  const pixels = sprite?.cels[cel.celId]?.pixels;
  if (!sprite || !pixels) throw new Error(`cel ${cel.celId} is missing after the commit`);
  return [...readRect(pixels, sprite.width, cel.rect)];
};

const expectPreviewEqualsCommit = (artwork: Artwork, step: CommandStep): TransactionOk => {
  const previewed = pixelEngine(artwork);
  const base = previewed.state().artwork;
  const preview = okOf(previewed.execute(request([step], { mode: 'preview', previewPixels: 1_000_000 })));
  expectUntouched(previewed, base);
  const committed = pixelEngine(artwork);
  const commit = okOf(committed.execute(request([step])));
  const cels = preview.preview?.cels ?? [];
  expect(preview.changes).toEqual(commit.changes);
  expect(preview.warnings).toEqual(commit.warnings);
  expect(preview.preview?.truncated).toBe(false);
  expect(cels.length).toBe(commit.changes.sprites.flatMap((sprite) => sprite.cels).length);
  expect(cels.map((cel) => [...cel.pixels])).toEqual(cels.map((cel) => committedRect(committed.state().artwork, cel)));
  return commit;
};

export { expectOneUndo, expectPreviewEqualsCommit };
