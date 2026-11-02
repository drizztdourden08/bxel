/* @layer renderer-app @kind logic */
import { useToolPresetStore } from '../../stores/useToolPresetStore';
import { allPresets } from '../presets/all-presets';
import { applyPreset } from '../presets/apply-preset';
import { memberById } from '../tool-catalogue/member-by-id';
import { announcePreset } from '../tool-pick/announce-preset';
import { pointerPick } from '../tool-pick/pointer-pick';
import { parseQuickId } from './quick-id';

const pickQuick = (value: string): void => {
  const choice = parseQuickId(value);
  if (choice === null) return;
  if (choice.kind === 'preset') {
    const preset = allPresets(useToolPresetStore.getState().user).find((each) => each.id === choice.id);
    if (preset && applyPreset(preset)) announcePreset(preset);
    return;
  }
  const found = memberById(choice.id);
  if (found) pointerPick(found.member);
};

export { pickQuick };
