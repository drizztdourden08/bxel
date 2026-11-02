/* @layer renderer-app @kind logic */
import { allPresets } from '../../editor/presets/all-presets';
import { currentSurface } from '../../editor/tool-catalogue/current-surface';
import { slotsOf } from '../../editor/tool-catalogue/slots-of';
import type { DrawSurface } from '../../editor/tool-catalogue/tool-catalogue.type';
import { ALL_SURFACES } from '../../editor/tool-catalogue/surfaces.constants';
import { OPTION_SPECS } from '../../editor/tool-options/option-specs.constants';
import { optionSurface } from '../../editor/tool-options/option-surface';
import { useToolPrefsStore } from '../../stores/useToolPrefsStore';
import { useToolPresetStore } from '../../stores/useToolPresetStore';
import { useToolStore } from '../../stores/useToolStore';
import type { ToolHandler } from '../assistant.type';
import { presetRow } from './preset-row';
import { reply } from './reply';
import { toolOptionRow } from './tool-option-row';

const listTools: ToolHandler = (input) => {
  const { surface: asked } = input as { surface?: DrawSurface };
  const current = currentSurface();
  const surface: DrawSurface = asked ?? (current === 'none' ? 'sprite' : current);
  const own = optionSurface(surface);
  const hidden = useToolPrefsStore.getState().hiddenMembers;
  const inUse = useToolStore.getState().tool;
  const slots = slotsOf(surface).map((slot) => ({
    id: slot.id,
    group: slot.group,
    label: slot.label,
    key: slot.key,
    tool: slot.tool,
    surfaces: slot.surfaces,
    active: surface === current && slot.tool === inUse,
    members: slot.members.map((member) => ({ id: member.id, label: member.label, description: member.description, variant: member.variant?.value ?? null, hidden: hidden.includes(member.id) })),
    options: own === null ? [] : OPTION_SPECS.filter((spec) => spec.surface === own && spec.tool === slot.tool).sort((a, b) => a.priority - b.priority).map(toolOptionRow),
  }));
  const presets = allPresets(useToolPresetStore.getState().user).map(presetRow);
  return reply({ ok: true, surface, current, surfaces: ALL_SURFACES, slots, presets });
};

export { listTools };
