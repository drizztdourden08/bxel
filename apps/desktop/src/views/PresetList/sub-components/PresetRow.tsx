/* @layer renderer-app @kind component */
import { Box, Button, Shortcut, Tag, Text, TextInput } from '@drizztdourden08/tessera';
import { useState } from 'react';
import { applyPreset } from '../../../editor/presets/apply-preset';
import { presetSummary } from '../../../editor/presets/preset-summary';
import { announcePreset } from '../../../editor/tool-pick/announce-preset';
import { useKeysOf } from '../../../hooks/useKeysOf';
import { TOOL_COMMAND } from '../../../keymap/option-command-id.constants';
import { useToolPresetStore } from '../../../stores/useToolPresetStore';
import { PRESET_TEXT } from '../PresetList.constants';
import type { PresetRowProps } from '../PresetList.type';
import { PresetMenu } from './PresetMenu';
import { PresetPreview } from './PresetPreview';

const PresetRow = ({ preset, active, slot }: PresetRowProps) => {
  const [name, setName] = useState<string | null>(null);
  const keys = useKeysOf()(slot === null ? undefined : TOOL_COMMAND.quickPreset(slot));
  const commit = (): void => {
    if (name !== null && name.trim() !== '') useToolPresetStore.getState().rename(preset.id, name.trim());
    setName(null);
  };
  return (
    <Box as="li" className="preset-row" data-active={active}>
      <PresetPreview preset={preset} />
      <Box className="preset-row__text">
        {name === null ? (
          <Text variant="label">{preset.name}</Text>
        ) : (
          <TextInput size="sm" value={name} aria-label={PRESET_TEXT.nameField} autoFocus onChange={(event) => setName(event.target.value)} onEnter={commit} onBlur={commit} />
        )}
        <Text variant="caption" tone="muted">
          {preset.builtin === true ? `${PRESET_TEXT.builtIn}. ${presetSummary(preset)}` : presetSummary(preset)}
        </Text>
      </Box>
      <Box className="preset-row__actions">
        {keys && <Shortcut size="xs" keys={keys} />}
        {active ? (
          <Tag color="primary">{PRESET_TEXT.inUse}</Tag>
        ) : (
          <Button size="xs" variant="secondary" onClick={() => applyPreset(preset) && announcePreset(preset)}>
            {PRESET_TEXT.apply}
          </Button>
        )}
        <PresetMenu preset={preset} onRename={() => setName(preset.name)} />
      </Box>
    </Box>
  );
};

export { PresetRow };
