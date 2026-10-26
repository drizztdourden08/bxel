/* @layer renderer-app @kind logic */
import type { Artwork, DocumentId } from '@bxel/document';
import { PALETTE_COMMAND_NAME } from '@bxel/palette';
import type { DocumentHost } from '../documents/document-host.type';
import { bankPlan } from '../palette-source/bank-plan';
import { sourceColorText } from '../palette-source/source-color-text';
import { runSteps } from '../transactions/run-steps';
import type { AssetCreation } from './asset-plan.type';
import { ASSET_PLANS } from './asset-plans.constants';
import { NEW_LABEL, NEW_REF, NEW_TEXT } from './new-sprite.constants';
import type { CreationForm } from './new-sprite.type';
import { spriteNames } from './sprite-names';

const usableBank = (artwork: Artwork): string | null => {
  const known = artwork.banks.some((bank) => bank.id === artwork.defaultBankId);
  return known ? artwork.defaultBankId : (artwork.banks[0]?.id ?? null);
};

const ensureBank = (host: DocumentHost, documentId: DocumentId, form: CreationForm): string | null => {
  const artwork = host.view(documentId)?.state.artwork;
  if (!artwork) return null;
  const found = usableBank(artwork);
  if (found !== null) return found;
  const { bank } = bankPlan(form.source, form.limit, form.transparent);
  const options = { name: bank.name, cap: bank.cap, transparent: bank.transparent, colors: bank.colors.map(sourceColorText) };
  const made = runSteps(host, documentId, NEW_LABEL.sprite, [{ name: PALETTE_COMMAND_NAME.paletteCreate, targets: null, options, ref: NEW_REF }]);
  return made.ok ? (host.view(documentId)?.state.artwork.banks[0]?.id ?? null) : null;
};

const needsBank = (form: CreationForm): boolean => form.kind === 'sprite' || form.kind === 'animation' || form.kind === 'sheet' || form.kind === 'tileset';

const createAsset = (host: DocumentHost, documentId: DocumentId, form: CreationForm): AssetCreation => {
  const artwork = host.view(documentId)?.state.artwork;
  if (!artwork) return { ok: false, message: NEW_TEXT.needsFile };
  const bankId = needsBank(form) ? ensureBank(host, documentId, form) : null;
  const plan = ASSET_PLANS[form.kind]({ form, artwork: host.view(documentId)?.state.artwork ?? artwork, bankId });
  const done = runSteps(host, documentId, NEW_LABEL[form.kind === 'sheet' ? 'sheet' : 'sprite'], plan.steps);
  return done.ok ? { ok: true, key: plan.keyOf(done.created), names: spriteNames(form) } : { ok: false, message: done.error.message };
};

export { createAsset };
