/* @layer renderer-app @kind logic */
import { PALETTE_COMMAND_NAME } from '@bxel/palette';
import type { BankId } from '@bxel/document';
import { fileKit } from '../files/file-kit';
import { reasonOf } from '../files/reason-of';
import { uniqueName } from '../sprite-name/unique-name';
import { runSteps } from '../transactions/run-steps';
import { focusTab } from '../workspace/focus-tab';
import { saveTab } from '../workspace/save-tab';
import { tabOf } from '../workspace/tab-of';
import { PALETTE_REF } from './create-project-palette.constants';
import { focusedProject } from './focused-project';
import { PROJECT_CONFIG_TEXT } from './project-config.constants';
import type { PaletteSeed, ProjectOutcomeText } from './project-config.type';

const createProjectPalette = async (draft: PaletteSeed): Promise<ProjectOutcomeText> => {
  const focus = focusedProject();
  const kit = fileKit();
  if (!focus || !kit || focus.documentId === null || !focus.artwork) return PROJECT_CONFIG_TEXT.noWorkspace;
  const name = uniqueName(draft.name, focus.artwork.banks.map((bank) => bank.name));
  const options = { name, cap: draft.cap, transparent: draft.transparent, colors: draft.colors };
  const done = runSteps(kit.host, focus.documentId, PROJECT_CONFIG_TEXT.newPalette, [{ name: PALETTE_COMMAND_NAME.paletteCreate, targets: null, options, ref: PALETTE_REF }]);
  if (!done.ok) return done.error.message;
  const tab = tabOf(focus.documentId, { kind: 'palette', id: done.created[PALETTE_REF] as BankId });
  try {
    const saved = await saveTab(kit, tab, false);
    if (saved.kind === 'failed') return saved.message;
  } catch (error) {
    return reasonOf(error);
  }
  focusTab(tab);
  return null;
};

export { createProjectPalette };
