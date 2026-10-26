/* @layer renderer-app @kind component */
import { ColorSwatch, Flex, Shortcut } from '@drizztdourden08/tessera';
import { ActionHint } from '../../ActionHint';
import { chipHint, PALETTE_PANEL_TEXT } from '../PalettePanel.constants';
import type { HeldChipProps } from '../PalettePanel.type';

const HeldChip = ({ chip, slot, onEdit }: HeldChipProps) => (
  <Flex direction="column" align="center" gap="2xs" className="palette-panel__chip">
    <ActionHint hint={chipHint(chip)} placement="top" className="palette-panel__anchor">
      <ColorSwatch
        className="palette-panel__chip-colour"
        color={slot?.hex ?? ''}
        transparent={slot === undefined || slot.transparent}
        caption={chip.position}
        disabled={slot === undefined}
        aria-label={slot ? PALETTE_PANEL_TEXT.chip(chip.position, slot.label) : PALETTE_PANEL_TEXT.chipEmpty(chip.position)}
        onClick={(event) => slot && onEdit(slot.index, event.currentTarget)}
      />
    </ActionHint>
    <Shortcut size="xs" legend="symbol" keys={chip.pick.keys} mouse={chip.pick.mouse} />
  </Flex>
);

export { HeldChip };
