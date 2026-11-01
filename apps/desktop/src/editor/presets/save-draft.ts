/* @layer renderer-app @kind logic */
import { useProjectStore } from '../../stores/useProjectStore';
import { useToolPresetStore } from '../../stores/useToolPresetStore';
import { memberById } from '../tool-catalogue/member-by-id';
import { BUILTIN_PRESETS } from './builtin-presets.constants';
import { saveProjectPreset } from './save-project-preset';
import { snapshotFields } from './snapshot-fields';
import type { PresetDraft, ToolPreset } from './tool-preset.type';

const draftId = (scope: string, name: string): string => `${scope}.${Date.now().toString(36)}.${name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

const scopeOf = (draft: PresetDraft): string => (draft.inProject === true && useProjectStore.getState().project !== null ? 'project' : 'user');

const idOf = (draft: PresetDraft, name: string, scope: string): string => {
  const builtin = BUILTIN_PRESETS.some((each) => each.id === draft.replaces);
  const sameScope = draft.replaces?.startsWith(`${scope}.`) === true;
  return draft.replaces !== undefined && !builtin && sameScope ? draft.replaces : draftId(scope, name);
};

const saveDraft = (draft: PresetDraft): ToolPreset | null => {
  const found = memberById(draft.member);
  const name = draft.name.trim();
  if (!found || name === '' || draft.ticked.length === 0) return null;
  const scope = scopeOf(draft);
  const preset: ToolPreset = { id: idOf(draft, name, scope), name, member: draft.member, fields: snapshotFields(draft.ticked) };
  if (scope === 'project') void saveProjectPreset(preset);
  else useToolPresetStore.getState().save(preset);
  return preset;
};

export { saveDraft };
