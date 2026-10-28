/* @layer renderer-app @kind component */
import { Button, Icon, Text } from '@drizztdourden08/tessera';
import { allPresets } from '../../editor/presets/all-presets';
import { matchingPreset } from '../../editor/presets/matching-preset';
import { openSaveDraft } from '../../editor/presets/open-save-draft';
import { presetsOfTool } from '../../editor/presets/presets-of-tool';
import { quickPresets } from '../../editor/presets/quick-presets';
import { activeMember } from '../../editor/tool-pick/active-member';
import { useToolPresetStore } from '../../stores/useToolPresetStore';
import { useOptionsVersion } from '../OptionControls';
import { PRESET_TEXT } from './PresetList.constants';
import type { PresetListProps } from './PresetList.type';
import { PresetRow } from './sub-components/PresetRow';
import './PresetList.css';

const PresetList = ({ tool }: PresetListProps) => {
  const user = useToolPresetStore((state) => state.user);
  useOptionsVersion();
  const presets = presetsOfTool(allPresets(user), tool);
  const member = activeMember();
  const matched = member ? matchingPreset(presets, member.id) : undefined;
  const quick = quickPresets(tool);
  return (
    <section className="preset-list" aria-label={PRESET_TEXT.region}>
      {presets.length === 0 && (
        <Text variant="caption" tone="muted">
          {PRESET_TEXT.empty}
        </Text>
      )}
      <ul className="preset-list__rows" role="list">
        {presets.map((preset) => (
          <PresetRow key={preset.id} preset={preset} active={matched?.id === preset.id} slot={quick.indexOf(preset) < 0 ? null : quick.indexOf(preset) + 1} />
        ))}
      </ul>
      <Button size="sm" variant="secondary" icon={<Icon name="save" />} onClick={() => void openSaveDraft()}>
        {PRESET_TEXT.save}
      </Button>
    </section>
  );
};

export { PresetList };
