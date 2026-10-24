/* @layer core @kind logic */
import { presetUpdateSchema } from '../../schema/preset-update-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { pickPreset } from './pick-preset';
import { replacePreset } from './replace-preset';

const presetUpdate = defineCommand({
  name: COMMAND_NAME.presetUpdate,
  scope: 'none',
  schema: presetUpdateSchema,
  run: (draft, input) => {
    const { options } = input;
    const preset = pickPreset(draft, options.preset);
    replacePreset(draft, {
      ...preset,
      format: options.format ?? preset.format,
      scale: options.scale ?? preset.scale,
      pathTemplate: options.pathTemplate ?? preset.pathTemplate,
      settings: options.settings ?? preset.settings,
    });
  },
});

export { presetUpdate };
