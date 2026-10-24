/* @layer core @kind logic */
import { registerRef } from '../../draft/register-ref';
import { updateArtwork } from '../../draft/update-artwork';
import type { ExportPreset } from '../../model/export-preset.type';
import type { PresetId } from '../../model/ids.type';
import { presetAddSchema } from '../../schema/preset-add-schema';
import { checkName } from '../../validate/check-name';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { assertPresetNameFree } from './assert-preset-name-free';
import { ownerFields } from './owner-fields';
import { DEFAULT_PRESET_SCALE, DEFAULT_PRESET_TEMPLATE } from './preset.constants';

const presetAdd = defineCommand({
  name: COMMAND_NAME.presetAdd,
  scope: 'none',
  schema: presetAddSchema,
  run: (draft, input) => {
    const { options } = input;
    const name = checkName(options.name);
    const { sheetId, scope } = ownerFields(draft, options.owner);
    assertPresetNameFree(draft.artwork, { sheetId, scope }, name);
    const preset: ExportPreset = {
      id: draft.ids.next('exp') as PresetId,
      name,
      format: options.format,
      scale: options.scale ?? DEFAULT_PRESET_SCALE,
      scope,
      sheetId,
      pathTemplate: options.pathTemplate ?? DEFAULT_PRESET_TEMPLATE,
      settings: options.settings ?? {},
    };
    updateArtwork(draft, (artwork) => ({ ...artwork, presets: [...artwork.presets, preset] }));
    registerRef(draft, input.ref, preset.id);
  },
});

export { presetAdd };
