/* @layer renderer-app @kind component */
import { DropdownMenu } from '@drizztdourden08/tessera';
import type { MenuGroup } from '@drizztdourden08/tessera';
import { duplicatePreset } from '../../../editor/presets/duplicate-preset';
import { updatePreset } from '../../../editor/presets/update-preset';
import { useToolPresetStore } from '../../../stores/useToolPresetStore';
import { PRESET_TEXT } from '../PresetList.constants';
import type { ToolPreset } from '../../../editor/presets/tool-preset.type';
import type { PresetMenuProps } from './PresetMenu.type';

const userGroup = (preset: ToolPreset, onRename: () => void): MenuGroup => {
  const store = useToolPresetStore.getState();
  return {
    id: 'own',
    items: [
      { id: 'rename', label: PRESET_TEXT.rename, icon: 'pencil', onSelect: onRename },
      { id: 'update', label: PRESET_TEXT.update, icon: 'refresh-cw', onSelect: () => void updatePreset(preset) },
      { id: 'up', label: PRESET_TEXT.up, icon: 'arrow-up', onSelect: () => store.move(preset.id, -1) },
      { id: 'down', label: PRESET_TEXT.down, icon: 'arrow-down', onSelect: () => store.move(preset.id, 1) },
      { separator: true },
      { id: 'remove', label: PRESET_TEXT.remove, icon: 'trash-2', kind: 'confirm', confirm: PRESET_TEXT.confirmRemove, tone: 'danger', onSelect: () => store.remove(preset.id) },
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
