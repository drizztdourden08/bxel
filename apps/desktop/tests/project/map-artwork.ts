/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import type { Artwork, CommandStep } from '@bxel/document';
import { createDefaultArtwork } from '../../src/documents/create-default-artwork';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { runSteps } from '../../src/transactions/run-steps';

const step = (name: string, options: unknown, ref?: string): CommandStep => ({ name, targets: null, options, ...(ref ? { ref } : {}) });

const setSteps = (name: string, map: string): CommandStep[] => [
  step(COMMAND_NAME.tilesetCreate, { name, tileWidth: 4, tileHeight: 4 }, name),
  step(COMMAND_NAME.tileAdd, { tileset: { ref: name } }),
  step(COMMAND_NAME.tileAdd, { tileset: { ref: name } }),
  step(COMMAND_NAME.tilemapCreate, { name: map, tileset: { ref: name }, columns: 4, rows: 3 }),
];

const mapArtwork = (): Artwork => {
  const { host } = useDocumentStore.getState();
  const documentId = createDefaultArtwork(host);
  const made = runSteps(host, documentId, 'Maps', [...setSteps('ground', 'level'), ...setSteps('secret', 'vault')]);
  if (!made.ok) throw new Error(made.error.message);
  const artwork = host.view(documentId)?.state.artwork;
  host.close(documentId);
  if (!artwork) throw new Error('no artwork');
  return artwork;
};

export { mapArtwork };
