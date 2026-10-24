/* @layer renderer-app @kind logic */
import type { DocumentHost } from '../documents/document-host.type';
import { bankPlan } from '../palette-source/bank-plan';
import { bankSteps } from './bank-steps';
import { runSteps } from '../transactions/run-steps';
import { NEW_FILE_NAME, NEW_LABEL } from './new-sprite.constants';
import type { CreationForm, CreationOutcome } from './new-sprite.type';
import { spriteNames } from './sprite-names';
import { spriteSize } from './sprite-size';
import { sheetSteps } from './sheet-steps';
import { spriteSteps } from './sprite-steps';

const fillSlotOf = (form: CreationForm): number | null => (form.background === 'opaque' && form.backgroundSlot > 0 ? form.backgroundSlot : null);

const createNewFile = (host: DocumentHost, form: CreationForm): CreationOutcome => {
  const { bank } = bankPlan(form.source, form.limit, form.transparent);
  const names = spriteNames(form);
  const size = spriteSize(form);
  const created = host.create({
    name: NEW_FILE_NAME,
    ...(form.platformId === null ? {} : { platformId: form.platformId }),
    bank: { name: bank.name, cap: bank.cap, transparent: bank.transparent, colors: bank.colors },
    sprite: { name: names[0] ?? form.name.trim(), ...size },
  });
  if (!created.ok) return { ok: false, message: created.error.message };
  const { documentId } = created;
  const existingId = host.view(documentId)?.state.artwork.sprites[0]?.id ?? null;
  const steps = [...bankSteps(form), ...spriteSteps({ names, size, bankId: null, fillSlot: fillSlotOf(form), existingId }), ...sheetSteps(names, form, size, existingId)];
  if (steps.length === 0) return { ok: true, documentId, names };
  const done = runSteps(host, documentId, form.kind === 'sheet' ? NEW_LABEL.sheet : NEW_LABEL.sprite, steps);
  if (done.ok) return { ok: true, documentId, names };
  host.close(documentId);
  return { ok: false, message: done.error.message };
};

export { createNewFile };
