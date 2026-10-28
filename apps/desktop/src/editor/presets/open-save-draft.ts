/* @layer renderer-app @kind logic */
import { useToolPresetStore } from '../../stores/useToolPresetStore';
import { memberById } from '../tool-catalogue/member-by-id';
import { activeMember } from '../tool-pick/active-member';
import { presetFields } from './preset-fields';
import type { ToolPreset } from './tool-preset.type';

const openSaveDraft = (replacing?: ToolPreset): boolean => {
  const member = replacing ? memberById(replacing.member)?.member : activeMember();
  if (!member) return false;
  const ticked = replacing ? Object.keys(replacing.fields) : presetFields(member.tool).map((spec) => spec.id);
  useToolPresetStore.getState().openDraft({ member: member.id, name: replacing?.name ?? '', ticked, replaces: replacing?.id });
  return true;
};

export { openSaveDraft };
