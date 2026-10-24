/* @layer renderer-app @kind logic */
import { COMMAND_NAME, nameKey, presetsOf } from '@bxel/document';
import type { CommandStep } from '@bxel/document';
import { useDocumentStore } from '../stores/useDocumentStore';
import { runSteps } from '../transactions/run-steps';
import type { SavedPreset } from './export.type';
import type { PresetMoved } from './preset-entry.type';
import { presetFormat } from './preset-format';
import { PRESET_TEXT } from './preset-list.constants';
import { presetLive } from './preset-live';
import { presetSettingsJson } from './preset-settings-json';
import { uniquePresetName } from './unique-preset-name';

const stepsOf = (presets: readonly SavedPreset[], taken: Set<string>): readonly CommandStep[] =>
  presets.map(({ name, settings }) => {
    const unique = uniquePresetName(name, taken);
    taken.add(nameKey(unique));
    const options = { name: unique, owner: { project: true }, format: presetFormat(settings), scale: settings.scale, settings: presetSettingsJson(settings) };
    return { name: COMMAND_NAME.presetAdd, targets: null, options };
  });

const movePresets = (presets: readonly SavedPreset[]): PresetMoved => {
  const live = presetLive();
  if (!live || live.readOnly) return { ok: false, message: PRESET_TEXT.noProject };
  const { artwork } = live.context;
  const taken = new Set(presetsOf(artwork, { kind: 'project', id: artwork.id }).map((preset) => nameKey(preset.name)));
  const done = runSteps(useDocumentStore.getState().host, live.documentId, PRESET_TEXT.moveLabel, stepsOf(presets, taken));
  return done.ok ? { ok: true, count: presets.length } : { ok: false, message: done.error.message };
};

export { movePresets };
