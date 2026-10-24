/* @layer renderer-app @kind logic */
import { COMMAND_NAME, nameKey, presetsOf } from '@bxel/document';
import type { CommandStep } from '@bxel/document';
import { useDocumentStore } from '../stores/useDocumentStore';
import { runSteps } from '../transactions/run-steps';
import type { ExportSettings } from './export.type';
import type { PresetOwnerChoice, PresetSaved } from './preset-entry.type';
import { presetFormat } from './preset-format';
import { presetKey } from './preset-key';
import { PRESET_TEXT } from './preset-list.constants';
import { presetLive } from './preset-live';
import { presetOwnerOf } from './preset-owner-of';
import { presetPlace } from './preset-place';
import { presetSettingsJson } from './preset-settings-json';

const stepOf = (name: string, settings: ExportSettings, owner: PresetOwnerChoice, existing: string | null): CommandStep => {
  const input = { format: presetFormat(settings), scale: settings.scale, settings: presetSettingsJson(settings) };
  return existing === null
    ? { name: COMMAND_NAME.presetAdd, targets: null, options: { name, owner, ...input } }
    : { name: COMMAND_NAME.presetUpdate, targets: null, options: { preset: existing, ...input } };
};

const savePreset = (name: string, settings: ExportSettings): PresetSaved | null => {
  const live = presetLive();
  const owner = live && !live.readOnly ? presetOwnerOf(settings, live.context) : null;
  if (!live || !owner) return null;
  const { artwork } = live.context;
  const found = presetsOf(artwork, presetKey(owner, artwork)).find((preset) => nameKey(preset.name) === nameKey(name));
  const done = runSteps(useDocumentStore.getState().host, live.documentId, PRESET_TEXT.saveLabel, [stepOf(name, settings, owner, found?.id ?? null)]);
  return done.ok ? { ok: true, where: presetPlace(owner, artwork) } : { ok: false, message: done.error.message };
};

export { savePreset };
