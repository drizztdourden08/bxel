/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import type { Artwork, CommandStep } from '@bxel/document';
import { createDefaultArtwork } from '../../src/documents/create-default-artwork';
import { spritesTarget } from '../../src/sheet/sprites-target';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { runSteps } from '../../src/transactions/run-steps';

const frames = (spriteId: string, steps: readonly CommandStep[]): CommandStep[] => steps.map((step) => ({ ...step, targets: spritesTarget([spriteId as never]) }));

const animatedSampleArtwork = (): Artwork => {
  const { host } = useDocumentStore.getState();
  const documentId = createDefaultArtwork(host);
  const first = host.view(documentId)?.state.artwork.sprites[0];
  if (!first) throw new Error('no sprite');
  const tree = host.execute({
    documentId,
    baseRevision: host.view(documentId)?.state.revision ?? 0,
    mode: 'commit',
    origin: 'ui',
    label: 'Tree',
    steps: [{ name: COMMAND_NAME.spriteCreate, targets: null, options: { name: 'tree', width: 8, height: 8 } }],
    previewPixels: 0,
  });
  if (!tree.ok) throw new Error(tree.error.message);
  const steps = frames(first.id, [
    { name: COMMAND_NAME.frameAdd, targets: null, options: { durationMs: 120 } },
    { name: COMMAND_NAME.frameAdd, targets: null, options: { durationMs: 140 } },
    { name: COMMAND_NAME.tagAdd, targets: null, options: { name: 'run', from: { by: 'index', index: 0 }, to: { by: 'index', index: 2 }, direction: 'pingpong' } },
  ]);
  const done = runSteps(host, documentId, 'Frames', steps);
  if (!done.ok) throw new Error(done.error.message);
  const artwork = host.view(documentId)?.state.artwork;
  host.close(documentId);
  if (!artwork) throw new Error('no artwork');
  return artwork;
};

export { animatedSampleArtwork };
