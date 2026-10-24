/* @layer renderer-app @kind logic */
import { counterIdSource, createEngine, documentCommands } from '@bxel/document';
import type { Artwork, DocumentId } from '@bxel/document';
import { PALETTE_COMMAND_NAME, paletteCommands } from '@bxel/palette';
import { buildSampleArtwork } from './build-sample-artwork';
import { runStep } from './run-step';

const SECOND_PALETTE = 'Warm';

const buildTwoPaletteArtwork = (): Artwork => {
  const base = buildSampleArtwork();
  const engine = createEngine({
    state: { documentId: 'doc_000001' as DocumentId, revision: 1, artwork: base, readOnly: false },
    ids: counterIdSource(9000),
    commands: [...documentCommands, ...paletteCommands],
  });
  runStep(engine, PALETTE_COMMAND_NAME.paletteCreate, { name: SECOND_PALETTE, cap: 16, transparent: true, colors: ['#aa3300', '#ffcc00'] });
  return engine.state().artwork;
};

export { buildTwoPaletteArtwork, SECOND_PALETTE };
