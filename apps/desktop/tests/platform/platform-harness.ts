/* @layer renderer-app @kind test */
import type { Artwork, DocumentId, TargetScope, TransactionResult } from '@bxel/document';
import type { DocumentHost } from '../../src/documents/document-host.type';
import { changePlatform } from '../../src/new-sprite/change-platform';
import { createNewFile } from '../../src/new-sprite/create-new-file';
import { initialForm } from '../../src/new-sprite/initial-form';
import { NEW_MEMORY_DEFAULT } from '../../src/new-sprite/new-sprite.constants';
import type { CreationForm } from '../../src/new-sprite/new-sprite.type';
import { patchForm } from '../../src/new-sprite/patch-form';
import { setStrict } from '../../src/platform-preset/set-strict';
import { runSteps } from '../../src/transactions/run-steps';
import { newHost } from '../dialogs/dialog-harness';

interface PlatformFile {
  host: DocumentHost;
  documentId: DocumentId;
}

const blank = (): CreationForm => initialForm(NEW_MEMORY_DEFAULT, []);

const chosen = (id: string, tweak: Partial<CreationForm> = {}): CreationForm =>
  patchForm(patchForm(blank(), changePlatform(blank(), id)), { name: 'hero', ...tweak });

const platformFile = (form: CreationForm): PlatformFile => {
  const host = newHost();
  const outcome = createNewFile(host, form);
  if (!outcome.ok) throw new Error(outcome.message);
  return { host, documentId: outcome.documentId };
};

const strictSnes = (): PlatformFile => {
  const file = platformFile(chosen('snes-sprite'));
  const outcome = setStrict(file.host, file.documentId, true);
  if (!outcome.ok) throw new Error(outcome.message);
  return file;
};

const artworkOf = ({ host, documentId }: PlatformFile): Artwork => {
  const artwork = host.view(documentId)?.state.artwork;
  if (!artwork) throw new Error('no file');
  return artwork;
};

const revisionOf = ({ host, documentId }: PlatformFile): number => host.view(documentId)?.state.revision ?? 0;

const run = (file: PlatformFile, name: string, options: object, targets: TargetScope | null = null): TransactionResult =>
  runSteps(file.host, file.documentId, 'Test', [{ name, targets, options }]);

const spriteScope = (spriteId: string): TargetScope => ({
  sprites: [spriteId as never],
  layers: { by: 'all' },
  frames: { by: 'all' },
});

export { artworkOf, blank, chosen, platformFile, revisionOf, run, spriteScope, strictSnes };
export type { PlatformFile };
