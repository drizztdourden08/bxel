/* @layer renderer-app @kind component */
import { Stack, Text } from '@drizztdourden08/tessera';
import { PRESET_TEXT } from '../../../export/preset-list.constants';
import { PRESET_HEADING, PRESET_ORIGINS } from '../AssetControl.constants';
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
    <Stack gap="sm">
      {PRESET_ORIGINS.map((origin) => {
        const rows = model.rows.filter((row) => row.origin === origin);
        if (rows.length === 0) return null;
        return (
          <Stack key={origin} gap="xs">
            {PRESET_HEADING[origin] !== null && (
              <Text variant="label" tone="muted">
                {PRESET_HEADING[origin]}
              </Text>
            )}
            {rows.map((row) => (
              <PresetRow key={row.key} row={row} onRename={model.rename} onRemove={model.remove} onRun={model.run} />
            ))}
          </Stack>
        );
      })}
    </Stack>
  );
};

export { PresetsControl };
