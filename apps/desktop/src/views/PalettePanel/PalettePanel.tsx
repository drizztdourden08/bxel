/* @layer renderer-app @kind component */
import { EmptyState, Grid, Stack, Text } from '@drizztdourden08/tessera';
import { PALETTE_TEXT } from '../../editor/palette-text.constants';
import { swatchRole } from '../../editor/swatch-role';
import { useEditorTarget } from '../../hooks/useEditorTarget';
import { usePaletteSlots } from '../../hooks/usePaletteSlots';
import { useToolStore } from '../../stores/useToolStore';
import { PALETTE_COLUMNS, PALETTE_PANEL_TEXT } from './PalettePanel.constants';
import { BankRow } from './sub-components/BankRow';
import { PaletteSwatch } from './sub-components/PaletteSwatch';
import { PlatformRow } from './sub-components/PlatformRow';
import { SetLoader } from './sub-components/SetLoader';
import './PalettePanel.css';

const PalettePanel = () => {
  const target = useEditorTarget();
  const slots = usePaletteSlots();
  const foreground = useToolStore((state) => state.foreground);
  const background = useToolStore((state) => state.background);
  const setForeground = useToolStore((state) => state.setForeground);
  const setBackground = useToolStore((state) => state.setBackground);
  if (!target) return <EmptyState message={PALETTE_PANEL_TEXT.empty} />;
  const { bank } = target;
  return (
    <Stack gap="sm">
      <Text variant="label">{PALETTE_TEXT.title(bank.name)}</Text>
      <BankRow />
      <Text variant="caption" tone="muted">{PALETTE_TEXT.count(bank.cap, bank.transparent)}</Text>
      <Grid columns={PALETTE_COLUMNS} gap="xs" aria-label={PALETTE_PANEL_TEXT.grid}>
        {slots.map((slot) => (
          <PaletteSwatch
            key={slot.index}
            slot={slot}
            role={swatchRole(slot.index, foreground, background)}
            onPick={(index, which) => (which === 'foreground' ? setForeground(index) : setBackground(index))}
          />
        ))}
      </Grid>
      <Text variant="caption" tone="muted">{PALETTE_PANEL_TEXT.hint}</Text>
      <SetLoader />
      <PlatformRow />
    </Stack>
  );
};

export { PalettePanel };
