/* @layer renderer-app @kind component */
import type { BankId } from '@bxel/document';
import { DropdownMenu } from '@drizztdourden08/tessera';
import type { MenuItem } from '@drizztdourden08/tessera';
import { startSwitch } from '../../../palette-change/start-switch';
import { stripColours } from '../behavior/strip-colours';
import { PALETTE_PANEL_TEXT } from '../PalettePanel.constants';
import type { PanelProps } from '../PalettePanel.type';
import { SwatchStrip } from '../../SwatchStrip';

const PaletteSwitcher = ({ panel }: PanelProps) => {
  const { bank, sprite } = panel.target;
  const items: MenuItem[] = panel.artwork.banks.map((each) => ({
    id: each.id,
    label: each.name,
    description: PALETTE_PANEL_TEXT.colours(each.slots.filter((slot) => slot.kind === 'color').length),
    icon: <SwatchStrip colours={stripColours(each)} />,
    kind: 'radio',
    checked: each.id === bank.id,
    disabled: panel.lock.locked && each.id !== bank.id,
    onSelect: () => {
      if (each.id !== bank.id) startSwitch(sprite.id, each.id as BankId);
    },
  }));
  return (
    <DropdownMenu
      className="palette-panel__switcher"
      size="xs"
      variant="tertiary"
      label={PALETTE_PANEL_TEXT.switcher}
      trigger={{ label: bank.name, icon: <SwatchStrip colours={stripColours(bank)} /> }}
      groups={[{ id: 'palettes', label: PALETTE_PANEL_TEXT.switcher, items }]}
    />
  );
};

export { PaletteSwitcher };
