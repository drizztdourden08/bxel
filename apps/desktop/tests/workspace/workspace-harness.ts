/* @layer renderer-app @kind test */
import { COMMAND_NAME, splitIntoAssets } from '@bxel/document';
import type { Artwork, CommandStep, DocumentId, SpriteId } from '@bxel/document';
import { encodeArtwork } from '@bxel/document/native';
import { createDefaultArtwork } from '../../src/documents/create-default-artwork';
import { commitRequest } from '../../src/editor/commit-request';
import { activeTarget } from '../../src/editor/active-target';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { runSteps } from '../../src/transactions/run-steps';
import { encodeAsset } from '../../src/workspace/encode-asset';
import { spritesTarget } from '../../src/sheet/sprites-target';
import type { Disk } from '../project/memory-disk';

const clock = (): number => 1_700_000_000_000;

const sheetSteps = (name: string, ids: readonly SpriteId[]): CommandStep[] => [
  { name: COMMAND_NAME.sheetCreate, targets: null, options: { name }, ref: name },
  { name: COMMAND_NAME.sheetAdd, targets: spritesTarget(ids), options: { sheet: { ref: name } } },
];

const sampleArtwork = (): Artwork => {
  const { host } = useDocumentStore.getState();
  const documentId = createDefaultArtwork(host);
  const made = runSteps(host, documentId, 'Make', [{ name: COMMAND_NAME.spriteCreate, targets: null, options: { name: 'slime', width: 8, height: 8 } }]);
  if (!made.ok) throw new Error(made.error.message);
  const ids = host.view(documentId)?.state.artwork.sprites.map((sprite) => sprite.id) ?? [];
  const sheets = runSteps(host, documentId, 'Sheets', [...sheetSteps('walk', ids), ...sheetSteps('idle', ids)]);
  if (!sheets.ok) throw new Error(sheets.error.message);
  const artwork = host.view(documentId)?.state.artwork;
  host.close(documentId);
  if (!artwork) throw new Error('no artwork');
  return artwork;
};

const writeProjectAssets = (disk: Disk, root: string, artwork: Artwork): ReadonlyMap<string, string> => {
  const plan = splitIntoAssets(artwork);
  const paths = new Map(plan.files.map((file) => [file.key.id, `${root}/${file.path}`] as const));
  for (const file of plan.files) {
    const path = paths.get(file.key.id) ?? '';
    disk.dirs.add(path.slice(0, path.lastIndexOf('/')));
    disk.files.set(path, encodeAsset(artwork, file.key, paths, { preview: null, clock }));
  }
  return paths;
};

const legacyBytes = (artwork: Artwork): Uint8Array =>
  encodeArtwork({ documentId: 'doc_legacy' as DocumentId, revision: 1, artwork, readOnly: false }, null, clock);

const paintSprite = (documentId: DocumentId, spriteId: SpriteId, index = 1): void => {
  const { host } = useDocumentStore.getState();
  const target = activeTarget(host.view(documentId), null, spriteId);
  if (!target) throw new Error('no sprite to paint');
  const options = { points: [{ x: 0, y: 0 }], brush: { shape: 'square', size: 1 }, index };
  const result = host.execute(commitRequest(target, 'Pencil', { name: COMMAND_NAME.pixelsPaint, options }));
  if (!result.ok) throw new Error(result.error.message);
};

export { legacyBytes, paintSprite, sampleArtwork, writeProjectAssets };
