/* @layer core @kind logic */
import { addWarning, defineCommand, registerRef, updateProject } from '@bxel/document';
import { buildNewBank } from './build-new-bank';
import { PALETTE_COMMAND_NAME } from './palette-command-name.constants';
import { paletteCreateSchema } from './palette-create-schema';
import { WARNING_CODE } from './palette-warning.constants';

const paletteCreate = defineCommand({
  name: PALETTE_COMMAND_NAME.paletteCreate,
  scope: 'none',
  schema: paletteCreateSchema,
  run: (draft, input) => {
    const bank = buildNewBank(draft.ids, input.options);
    const colors = bank.slots.flatMap((slot) => (slot.kind === 'color' ? [slot.rgb] : []));
    for (const rgb of colors.filter((value, at) => colors.indexOf(value) !== at)) {
      addWarning(draft, WARNING_CODE.DUPLICATE_COLOR, `${rgb} appears more than once in bank "${bank.name}".`);
    }
    updateProject(draft, (project) => ({ ...project, banks: [...project.banks, bank] }));
    registerRef(draft, input.ref, bank.id);
  },
});

export { paletteCreate };
