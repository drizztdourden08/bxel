/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import type { Artwork, CommandStep } from '@bxel/document';
import { createDefaultArtwork } from '../../src/documents/create-default-artwork';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { runSteps } from '../../src/transactions/run-steps';

const SPRITE_SIDE = 16;
const PER_SHEET = 8;
const BATCH = 50;
const SHEET_BATCH = 100;

const pad = (value: number): string => String(value).padStart(4, '0');

const spriteSteps = (from: number, to: number): CommandStep[] =>
  Array.from({ length: to - from }, (_, at) => ({
    name: COMMAND_NAME.spriteCreate,
    targets: null,
    options: { name: `s${pad(from + at)}`, width: SPRITE_SIDE, height: SPRITE_SIDE },
  }));

const sheetSteps = (artwork: Artwork, range: { readonly from: number; readonly to: number }): CommandStep[] => {
  const ids = artwork.sprites.map((sprite) => sprite.id);
  return Array.from({ length: range.to - range.from }, (_, at) => range.from + at).flatMap((at) => {
    const name = `sh${pad(at)}`;
    const members = ids.slice(at * PER_SHEET, (at + 1) * PER_SHEET);
    return [
      { name: COMMAND_NAME.sheetCreate, targets: null, options: { name }, ref: name },
      { name: COMMAND_NAME.sheetAdd, targets: { sprites: members, layers: { by: 'all' as const }, frames: { by: 'all' as const } }, options: { sheet: { ref: name } } },
    ];
  });
};

const manyArtwork = (assets: number): Artwork => {
  const { host } = useDocumentStore.getState();
  const documentId = createDefaultArtwork(host);
  const sheets = Math.floor(assets / (PER_SHEET + 1));
  const sprites = assets - sheets - 1;
  for (let from = 1; from < sprites; from += BATCH) {
    const made = runSteps(host, documentId, 'Sprites', spriteSteps(from + 1, Math.min(from + BATCH, sprites) + 1));
    if (!made.ok) throw new Error(made.error.message);
  }
  const current = host.view(documentId)?.state.artwork;
  if (!current) throw new Error('no artwork');
  for (let from = 0; from < sheets; from += SHEET_BATCH) {
    const filled = runSteps(host, documentId, 'Sheets', sheetSteps(current, { from, to: Math.min(from + SHEET_BATCH, sheets) }));
    if (!filled.ok) throw new Error(filled.error.message);
  }
  const artwork = host.view(documentId)?.state.artwork;
  host.close(documentId);
  if (!artwork) throw new Error('no artwork');
  return artwork;
};

export { manyArtwork };
