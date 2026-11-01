/* @layer renderer-app @kind logic */
import { allPresets } from '../../editor/presets/all-presets';
import { matchingPreset } from '../../editor/presets/matching-preset';
import { activeMember } from '../../editor/tool-pick/active-member';
import { currentSurface } from '../../editor/tool-catalogue/current-surface';
import { slotOfTool } from '../../editor/tool-catalogue/slot-of-tool';
import { surfaceKind } from '../../editor/tool-catalogue/surface-kind';
import { optionsOf } from '../../editor/tool-options/options-of';
import { readOption } from '../../editor/tool-options/read-option';
import { useSpringStore } from '../../editor/tool-pick/behavior/useSpringStore';
import { useToolPresetStore } from '../../stores/useToolPresetStore';
import { useToolStore } from '../../stores/useToolStore';

const toolView = () => {
  const tools = useToolStore.getState();
  const surface = currentSurface();
  const member = activeMember();
  const presets = allPresets(useToolPresetStore.getState().user);
  const spring = useSpringStore.getState();
  return {
    surface,
    member: member?.id ?? null,
    slot: slotOfTool(surface, tools.tool)?.id ?? null,
    previous: tools.previousTool,
    borrowed: spring.borrowed === null ? null : { tool: spring.borrowed, from: spring.tool ?? tools.tool },
    preset: member ? (matchingPreset(presets, member.id)?.id ?? null) : null,
    recent: tools.recentMembers[surfaceKind(surface)],
    options: Object.fromEntries(optionsOf(surface, tools.tool).filter((spec) => spec.kind !== 'action').map((spec) => [spec.id, readOption(spec)])),
  };
};

export { toolView };
