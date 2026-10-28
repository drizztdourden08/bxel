/* @layer renderer-app @kind logic */
import { allPresets } from '../editor/presets/all-presets';
import { matchingPreset } from '../editor/presets/matching-preset';
import { presetsOfTool } from '../editor/presets/presets-of-tool';
import { shownMember } from '../editor/tool-catalogue/shown-member';
import type { ToolSlot } from '../editor/tool-catalogue/tool-catalogue.type';
import { optionsOf } from '../editor/tool-options/options-of';
import { useSelectionStore } from '../stores/useSelectionStore';
import { useToolPrefsStore } from '../stores/useToolPrefsStore';
import { useToolPresetStore } from '../stores/useToolPresetStore';
import { useToolStore } from '../stores/useToolStore';
import type { Surface } from '../editor/tool-catalogue/surface.type';
import type { FlyoutModel } from './tool-menu.type';

const flyoutModel = (slot: ToolSlot, surface: Surface): FlyoutModel => {
  const hiddenMembers = useToolPrefsStore.getState().hiddenMembers;
  const members = slot.members.filter((member) => !hiddenMembers.includes(member.id));
  const shown = shownMember(slot, { shape: useToolStore.getState().shape, variant: useSelectionStore.getState().variant });
  const options = optionsOf(surface, slot.tool).filter((spec) => spec.flyout === true);
  const presets = surface === 'map' ? [] : presetsOfTool(allPresets(useToolPresetStore.getState().user), slot.tool);
  return {
    slot,
    members,
    shown,
    options,
    presets,
    matched: matchingPreset(presets, shown.id),
    hidden: slot.members.every((member) => hiddenMembers.includes(member.id)),
    hasContent: members.length > 1 || options.length > 0 || presets.length > 0,
  };
};

export { flyoutModel };
