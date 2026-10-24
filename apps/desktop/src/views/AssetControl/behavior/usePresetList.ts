/* @layer renderer-app @kind hook */
import { nav, useSettings } from '@drizztdourden08/brock-react';
import { deleteDocumentPreset } from '../../../export/delete-document-preset';
import { NO_PRESETS } from '../../../export/export.constants';
import { PRESET_KINDS, PRESET_TEXT } from '../../../export/preset-list.constants';
import { removePreset } from '../../../export/remove-preset';
import { renameDocumentPreset } from '../../../export/rename-document-preset';
import { renamePreset } from '../../../export/rename-preset';
import { runPreset } from '../../../export/run-preset';
import { usePresetEntries } from '../../../hooks/usePresetEntries';
import type { AppSettings } from '../../../settings.type';
import type { PresetListModel } from '../AssetControl.type';

const usePresetList = (group: 'sprite' | 'sheet'): PresetListModel => {
  const { settings, patch } = useSettings<AppSettings>();
  const app = settings.exportPresets ?? NO_PRESETS;
  const entries = usePresetEntries().filter((entry) => PRESET_KINDS[group].includes(entry.settings.kind));
  const rows = entries.map((entry) => ({ key: entry.key, name: entry.name, origin: entry.origin, detail: PRESET_TEXT.detail(entry.settings.kind, entry.settings.scale) }));
  const rename = (key: string, to: string): string | null => {
    const entry = entries.find((each) => each.key === key);
    if (!entry) return null;
    if (entry.id !== null) return renameDocumentPreset(entry.id, to);
    const edit = renamePreset(app, entry.name, to);
    if (edit.ok) patch({ exportPresets: edit.presets });
    return edit.ok ? null : edit.message;
  };
  const remove = (key: string): void => {
    const entry = entries.find((each) => each.key === key);
    if (!entry) return;
    if (entry.id !== null) deleteDocumentPreset(entry.id);
    else patch({ exportPresets: removePreset(app, entry.name) });
  };
  const run = (key: string): void => {
    const entry = entries.find((each) => each.key === key);
    if (!entry) return;
    nav.close();
    runPreset(entry.settings);
  };
  return { rows, rename, remove, run };
};

export { usePresetList };
