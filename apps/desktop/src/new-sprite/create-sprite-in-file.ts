/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep, DocumentId, SpriteId } from '@bxel/document';
import type { DocumentHost } from '../documents/document-host.type';
import { chooseSprites } from '../sheet/choose-sprites';
import { runSteps } from '../transactions/run-steps';
import { NEW_LABEL, NEW_REF, NEW_TEXT } from './new-sprite.constants';
import type { InFileOutcome, SpriteDraft } from './new-sprite.type';
import { spriteSteps } from './sprite-steps';

const joinSheet = (host: DocumentHost, documentId: DocumentId): CommandStep[] => {
  const sheet = host.view(documentId)?.state.artwork.sheets[0];
  if (!sheet) return [];
  return [
    {
      name: COMMAND_NAME.sheetAdd,
      targets: { sprites: [{ ref: NEW_REF }], layers: { by: 'all' }, frames: { by: 'all' } },
      options: { sheet: sheet.id },
    },
  ];
};

const createSpriteInFile = (host: DocumentHost, documentId: DocumentId, draft: SpriteDraft): InFileOutcome => {
  const view = host.view(documentId);
  if (!view) return { ok: false, message: NEW_TEXT.noFile };
  const name = draft.name.trim();
  const size = { width: draft.width, height: draft.height };
  const steps = spriteSteps({ names: [name], size, bankId: view.state.artwork.defaultBankId, fillSlot: null, existingId: null, pixelGrid: draft.pixelGrid });
  const done = runSteps(host, documentId, NEW_LABEL.sprite, [...steps, ...joinSheet(host, documentId)]);
  if (!done.ok) return { ok: false, message: done.error.message };
  const made = done.created[NEW_REF] as SpriteId | undefined;
  if (made !== undefined) chooseSprites({ selected: [made], anchor: made, active: made });
  return { ok: true, names: [name] };
};

export { createSpriteInFile };
