/* @layer renderer-app @kind logic */
import { useToolPresetStore } from '../../stores/useToolPresetStore';
import { memberById } from '../tool-catalogue/member-by-id';
import { BUILTIN_PRESETS } from './builtin-presets.constants';
import { snapshotFields } from './snapshot-fields';
import type { PresetDraft, ToolPreset } from './tool-preset.type';

const draftId = (name: string): string => `user.${Date.now().toString(36)}.${name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

const idOf = (draft: PresetDraft, name: string): string => {
  const builtin = BUILTIN_PRESETS.some((each) => each.id === draft.replaces);
  return draft.replaces !== undefined && !builtin ? draft.replaces : draftId(name);
};

const saveDraft = (draft: PresetDraft): ToolPreset | null => {
  const found = memberById(draft.member);
  const name = draft.name.trim();
  if (!found || name === '' || draft.ticked.length === 0) return null;
  const preset: ToolPreset = { id: idOf(draft, name), name, member: draft.member, fields: snapshotFields(draft.ticked) };
  useToolPresetStore.getState().save(preset);
  return preset;
};

export { saveDraft };
