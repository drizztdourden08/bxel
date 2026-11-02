/* @layer renderer-app @kind component */
import { DropdownMenu } from '@drizztdourden08/tessera';
import type { MenuGroup, MenuItem } from '@drizztdourden08/tessera';
import { duplicatePreset } from '../../../editor/presets/duplicate-preset';
import { movePresetScope } from '../../../editor/presets/move-preset-scope';
import { removeProjectPreset } from '../../../editor/presets/remove-project-preset';
import { updatePreset } from '../../../editor/presets/update-preset';
import { useProjectStore } from '../../../stores/useProjectStore';
import { useToolPresetStore } from '../../../stores/useToolPresetStore';
import { PRESET_TEXT } from '../PresetList.constants';
import type { ToolPreset } from '../../../editor/presets/tool-preset.type';
import type { PresetMenuProps } from './PresetMenu.type';

const scopeItem = (preset: ToolPreset): MenuItem[] =>
  useProjectStore.getState().project === null
    ? []
    : [{ id: 'scope', label: preset.project === true ? PRESET_TEXT.toMine : PRESET_TEXT.toProject, icon: 'folder', onSelect: () => void movePresetScope(preset) }];

const orderItems = (preset: ToolPreset): MenuItem[] => {
  const store = useToolPresetStore.getState();
  return preset.project === true
    ? []
    : [
        { id: 'up', label: PRESET_TEXT.up, icon: 'arrow-up', onSelect: () => store.move(preset.id, -1) },
        { id: 'down', label: PRESET_TEXT.down, icon: 'arrow-down', onSelect: () => store.move(preset.id, 1) },
      ];
};

const userGroup = (preset: ToolPreset, onRename: () => void): MenuGroup => {
  const store = useToolPresetStore.getState();
  const remove = (): void => (preset.project === true ? void removeProjectPreset(preset.id) : store.remove(preset.id));
  return {
    id: 'own',
    items: [
      { id: 'rename', label: PRESET_TEXT.rename, icon: 'pencil', onSelect: onRename },
      { id: 'update', label: PRESET_TEXT.update, icon: 'refresh-cw', onSelect: () => void updatePreset(preset) },
      ...orderItems(preset),
      ...scopeItem(preset),
      { separator: true },
      { id: 'remove', label: PRESET_TEXT.remove, icon: 'trash-2', kind: 'confirm', confirm: PRESET_TEXT.confirmRemove, tone: 'danger', onSelect: remove },
    ],
  };
};

const PresetMenu = ({ preset, onRename }: PresetMenuProps) => {
  const groups: MenuGroup[] = [
    { id: 'copy', items: [{ id: 'duplicate', label: PRESET_TEXT.duplicate, icon: 'copy', onSelect: () => duplicatePreset(preset) }] },
    ...(preset.builtin === true ? [] : [userGroup(preset, onRename)]),
  ];
  return <DropdownMenu size="xs" trigger={{ label: PRESET_TEXT.actions(preset.name), icon: 'ellipsis', iconOnly: true }} groups={groups} />;
};

export { PresetMenu };
