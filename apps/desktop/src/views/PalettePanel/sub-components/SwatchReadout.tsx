/* @layer renderer-app @kind component */
import { Flex, Shortcut, Stack, Text } from '@drizztdourden08/tessera';
import { SwatchStrip } from '../../SwatchStrip';
import { usageText } from '../behavior/usage-text';
import { HELD_CHIPS } from '../PalettePanel.constants';
import type { PanelProps } from '../PalettePanel.type';

const SwatchReadout = ({ panel }: PanelProps) => {
  const index = panel.hovered ?? panel.selection.focus;
  const slot = panel.slots[index];
  if (!slot) return null;
  const use = usageText(panel, index);
  return (
    <Flex align="center" gap="sm" className="swatch-readout" aria-hidden>
      <SwatchStrip size="md" colours={[slot.hex]} />
      <Stack gap="2xs" className="swatch-readout__text">
        <Text variant="caption" className="swatch-readout__name">
          {use === '' ? slot.label : `${slot.label}, ${use}`}
        </Text>
        <Flex gap="xs" wrap>
          {HELD_CHIPS.map((chip) => (
            <Flex key={chip.slot} align="center" gap="2xs">
              <Shortcut size="xs" legend="symbol" keys={chip.pick.keys} mouse={chip.pick.mouse} />
              <Text variant="caption" tone="muted">{chip.position}</Text>
            </Flex>
          ))}
        </Flex>
      </Stack>
    </Flex>
  );
};

export { SwatchReadout };
