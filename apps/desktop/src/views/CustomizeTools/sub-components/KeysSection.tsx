/* @layer renderer-app @kind component */
import { Stack, Text } from '@drizztdourden08/tessera';
import { allPresets } from '../../../editor/presets/all-presets';
import { slotsOf } from '../../../editor/tool-catalogue/slots-of';
import { useCatalogueSurface } from '../../../hooks/useCatalogueSurface';
import { useKeysOf } from '../../../hooks/useKeysOf';
import { useToolKeys } from '../../../hooks/useToolKeys';
import { TOOL_COMMAND } from '../../../keymap/option-command-id.constants';
import { useProjectStore } from '../../../stores/useProjectStore';
import { useToolPresetStore } from '../../../stores/useToolPresetStore';
import { CUSTOMIZE_TEXT } from '../CustomizeTools.constants';
import { KeyRow } from './KeyRow';

const KeysSection = () => {
  const surface = useCatalogueSurface();
  const toolKeys = useToolKeys();
  const keysOf = useKeysOf();
  const user = useToolPresetStore((state) => state.user);
  useProjectStore((state) => state.project?.manifest.toolPresets);
  const own = allPresets(user).filter((preset) => preset.builtin !== true);
  return (
    <Stack gap="md">
      <Stack gap="xs" role="group" aria-label={CUSTOMIZE_TEXT.keys}>
        <Text variant="label">{CUSTOMIZE_TEXT.keys}</Text>
        <Text variant="caption" tone="muted">
          {CUSTOMIZE_TEXT.keysHint}
        </Text>
        {slotsOf(surface).map((slot) => (
          <KeyRow key={slot.id} label={slot.label} keys={toolKeys(slot.tool)} />
        ))}
      </Stack>
      <Stack gap="xs" role="group" aria-label={CUSTOMIZE_TEXT.heldKeys}>
        <Text variant="label">{CUSTOMIZE_TEXT.heldKeys}</Text>
        <Text variant="caption" tone="muted">
          {CUSTOMIZE_TEXT.heldHint}
        </Text>
        <KeyRow label={CUSTOMIZE_TEXT.space} keys={['space']} />
        <KeyRow label={CUSTOMIZE_TEXT.alt} keys={['alt']} />
        <KeyRow label={CUSTOMIZE_TEXT.resize} keys={['ctrl', 'alt']} />
        <Text variant="caption" tone="muted">
          {CUSTOMIZE_TEXT.resizeHint}
        </Text>
      </Stack>
      {own.length > 0 && (
        <Stack gap="xs" role="group" aria-label={CUSTOMIZE_TEXT.presetKeys}>
          <Text variant="label">{CUSTOMIZE_TEXT.presetKeys}</Text>
          <Text variant="caption" tone="muted">
            {CUSTOMIZE_TEXT.presetKeysHint}
          </Text>
          {own.map((preset) => (
            <KeyRow key={preset.id} label={preset.name} keys={keysOf(TOOL_COMMAND.presetKey(preset.id))} />
          ))}
        </Stack>
      )}
    </Stack>
  );
};

export { KeysSection };
