/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import type { DocumentHost } from '../documents/document-host.type';
import { runSteps } from '../transactions/run-steps';
import { NEW_LABEL, NEW_TEXT } from './new-sprite.constants';
import type { InFileOutcome, SpriteDraft } from './new-sprite.type';
import { spriteSteps } from './sprite-steps';

const createSpriteInFile = (host: DocumentHost, documentId: DocumentId, draft: SpriteDraft): InFileOutcome => {
  const view = host.view(documentId);
  if (!view) return { ok: false, message: NEW_TEXT.noFile };
  const name = draft.name.trim();
  const size = { width: draft.width, height: draft.height };
  const steps = spriteSteps({ names: [name], size, bankId: view.state.artwork.defaultBankId, fillSlot: null, existingId: null });
  const done = runSteps(host, documentId, NEW_LABEL.sprite, steps);
  return done.ok ? { ok: true, names: [name] } : { ok: false, message: done.error.message };
};

export { createSpriteInFile };
