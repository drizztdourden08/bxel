/* @layer renderer-app @kind component */
import { ColorSwatch, Flex, Icon, Text } from '@drizztdourden08/tessera';
import { ActionHint } from '../../ActionHint';
import { chipName } from '../behavior/chip-name';
import { chipHint, PALETTE_PANEL_TEXT } from '../PalettePanel.constants';
import type { HeldChipProps } from '../PalettePanel.type';

const HeldChip = ({ chip, panel }: HeldChipProps) => {
  const index = panel.held[chip.slot];
  const slot = panel.slots[index];
  const past = slot === undefined;
  return (
    <Flex direction="column" align="center" gap="2xs" className="palette-panel__chip">
      <ActionHint hint={chipHint(chip)} placement="top" className="palette-panel__anchor">
        <ColorSwatch
          className={past ? 'palette-panel__chip-colour palette-panel__chip-colour--past' : 'palette-panel__chip-colour'}
          color={slot?.hex ?? ''}
          transparent={past || slot.transparent}
          data-held-slot={chip.position}
          caption={chip.position}
          aria-label={chipName(chip.position, index, slot?.label)}
          onMouseEnter={() => panel.setHinted(past ? null : index)}
          onMouseLeave={() => panel.setHinted(null)}
          onClick={(event) => slot && panel.editor.open(slot.index, event.currentTarget)}
        />
      </ActionHint>
      <Flex align="center" gap="2xs">
        {past && <Icon name="triangle-alert" size={10} className="palette-panel__chip-warning" />}
        <Text variant="caption" tone={past ? 'warning' : 'muted'} className="palette-panel__chip-index">
          {PALETTE_PANEL_TEXT.chipIndex(index)}
        </Text>
      </Flex>
    </Flex>
  );
};

export { HeldChip };
