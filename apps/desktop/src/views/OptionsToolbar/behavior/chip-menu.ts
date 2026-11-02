/* @layer renderer-app @kind logic */
import { useWidgetLayoutStore } from '@drizztdourden08/brock-react';
import type { MenuGroup, MenuItem, MenuNode } from '@drizztdourden08/tessera';
import { allPresets } from '../../../editor/presets/all-presets';
import { applyPreset } from '../../../editor/presets/apply-preset';
import { duplicatePreset } from '../../../editor/presets/duplicate-preset';
import { openSaveDraft } from '../../../editor/presets/open-save-draft';
import { removeProjectPreset } from '../../../editor/presets/remove-project-preset';
import { updatePreset } from '../../../editor/presets/update-preset';
import type { ToolPreset } from '../../../editor/presets/tool-preset.type';
import { memberById } from '../../../editor/tool-catalogue/member-by-id';
import { announcePreset } from '../../../editor/tool-pick/announce-preset';
import { useChipMenuStore } from '../../../stores/useChipMenuStore';
import { useToolPresetStore } from '../../../stores/useToolPresetStore';
import { flyoutGroups } from '../../../tool-menu/flyout-groups';
import type { FlyoutModel } from '../../../tool-menu/tool-menu.type';
import { flyoutSections } from '../../../tool-menu/flyout-sections';
import { OPTIONS_WIDGET_ID, TOOL_MENU_TEXT } from '../../../tool-menu/tool-menu.constants';
import { OPTIONS_TEXT } from '../OptionsToolbar.constants';

const applyItem = (preset: ToolPreset, label: string): MenuItem => ({
  id: preset.id,
  label,
  onSelect: () => {
    if (applyPreset(preset)) announcePreset(preset);
  },
});

const toolName = (preset: ToolPreset): string => memberById(preset.member)?.member.label ?? preset.member;

const scopeGroup = (everyTool: boolean): MenuGroup => ({
  id: 'scope',
  items: [{ id: 'current-tool-only', label: OPTIONS_TEXT.currentToolOnly, kind: 'check', checked: !everyTool, onSelect: () => useChipMenuStore.getState().setEveryTool(!everyTool) }],
});

const removePreset = (preset: ToolPreset): void => {
  if (preset.project === true) void removeProjectPreset(preset.id);
  else useToolPresetStore.getState().remove(preset.id);
};

const ownItems = (preset: ToolPreset): MenuNode[] =>
  preset.builtin === true
    ? []
    : [
        { id: 'rename', label: OPTIONS_TEXT.renamePreset, icon: 'pencil', onSelect: () => void openSaveDraft(preset) },
        { id: 'remove', label: OPTIONS_TEXT.deletePreset, icon: 'trash-2', kind: 'confirm', confirm: OPTIONS_TEXT.confirmDelete, tone: 'danger', onSelect: () => removePreset(preset) },
      ];

const updateItems = (model: FlyoutModel): MenuNode[] => {
  const own = model.presets.filter((preset) => preset.builtin !== true);
  if (model.matched !== undefined || own.length === 0) return [];
  return [{ id: 'update', label: OPTIONS_TEXT.updatePreset, icon: 'refresh-cw', children: own.map((preset) => ({ id: `update-${preset.id}`, label: preset.name, onSelect: () => void updatePreset(preset) })) }];
};

const actionGroup = (model: FlyoutModel): MenuGroup => {
  const { matched } = model;
  const manage: MenuItem = { id: 'manage', label: OPTIONS_TEXT.managePresets, icon: 'panel-right', onSelect: () => useWidgetLayoutStore.getState().open(OPTIONS_WIDGET_ID) };
  const copy: MenuNode[] = matched === undefined ? [] : [{ id: 'duplicate', label: OPTIONS_TEXT.duplicatePreset, icon: 'copy', onSelect: () => duplicatePreset(matched) }];
  return { id: 'preset-actions', items: [...updateItems(model), ...copy, ...(matched === undefined ? [] : ownItems(matched)), manage] };
};

const presetGroup = (model: FlyoutModel, everyTool: boolean): MenuGroup[] => {
  const groups = flyoutGroups(flyoutSections(model, false).filter((section) => section.id === 'presets'));
  const own = groups[0];
  if (!everyTool || own === undefined) return groups;
  const all = allPresets(useToolPresetStore.getState().user).map((preset) => applyItem(preset, OPTIONS_TEXT.allToolsPreset(toolName(preset), preset.name)));
  const save = own.items.filter((item) => 'id' in item && item.id === 'save-preset');
  return [{ id: 'presets', label: TOOL_MENU_TEXT.presets, items: [...all, ...save] }];
};

const chipMenu = (model: FlyoutModel, everyTool: boolean): MenuGroup[] => [scopeGroup(everyTool), ...presetGroup(model, everyTool), actionGroup(model)];

export { chipMenu };
