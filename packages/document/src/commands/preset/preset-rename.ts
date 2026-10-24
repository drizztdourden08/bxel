/* @layer core @kind logic */
import { presetRenameSchema } from '../../schema/preset-rename-schema';
import { checkName } from '../../validate/check-name';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { assertPresetNameFree } from './assert-preset-name-free';
import { pickPreset } from './pick-preset';
import { replacePreset } from './replace-preset';

const presetRename = defineCommand({
  name: COMMAND_NAME.presetRename,
  scope: 'none',
  schema: presetRenameSchema,
  run: (draft, input) => {
    const preset = pickPreset(draft, input.options.preset);
    const name = checkName(input.options.name);
    assertPresetNameFree(draft.artwork, preset, name, preset.id);
    if (name !== preset.name) replacePreset(draft, { ...preset, name });
  },
});

export { presetRename };
