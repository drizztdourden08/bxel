/* @layer renderer-app @kind component */
import { Stack, Text } from '@drizztdourden08/tessera';
import { PRESET_TEXT } from '../../../export/preset-list.constants';
import { usePresetList } from '../behavior/usePresetList';
import { PresetRow } from './PresetRow';

const PresetsControl = ({ group }: { group: 'sprite' | 'sheet' }) => {
  const model = usePresetList(group);
  if (model.rows.length === 0) {
    return (
      <Text variant="caption" tone="muted">
        {PRESET_TEXT.empty}
      </Text>
    );
  }
  return (
    <Stack gap="xs">
      {model.rows.map((row) => (
        <PresetRow key={row.name} row={row} onRename={model.rename} onRemove={model.remove} onRun={model.run} />
      ))}
    </Stack>
  );
};

export { PresetsControl };
