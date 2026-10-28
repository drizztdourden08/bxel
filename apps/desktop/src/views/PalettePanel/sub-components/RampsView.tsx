/* @layer renderer-app @kind component */
import { rampSlots } from '@bxel/palette';
import { Button, EmptyState, Icon, ScrollArea, Stack } from '@drizztdourden08/tessera';
import { openRampBuilder } from '../behavior/open-ramp-builder';
import { PALETTE_PANEL_TEXT, RAMP_ROW_TEXT } from '../PalettePanel.constants';
import type { PanelProps } from '../PalettePanel.type';
import { RampRow } from './RampRow';

const RampsView = ({ panel }: PanelProps) => {
  const { bank } = panel.target;
  const ramped = new Set(bank.ramps.flatMap((ramp) => ramp.swatches));
  const loose = bank.slots.flatMap((slot, index) => (slot.kind === 'color' && !ramped.has(slot.id) ? [index] : []));
  return (
    <ScrollArea axis="y" scrollbar="slim" fade={false} className="palette-panel__swatches">
      <Stack gap="xs">
        {bank.ramps.length === 0 && <EmptyState size="sm" icon={<Icon name="pixel-shade" size={16} />} message={PALETTE_PANEL_TEXT.noRamps} />}
        {bank.ramps.map((ramp) => (
          <RampRow key={ramp.id} panel={panel} ramp={ramp} indices={rampSlots(bank, ramp)} />
        ))}
        {loose.length > 0 && <RampRow panel={panel} ramp={null} indices={loose} />}
        <Button size="sm" variant="secondary" disabled={panel.lock.locked} onClick={() => openRampBuilder(panel)}>
          {RAMP_ROW_TEXT.newRamp}
        </Button>
      </Stack>
    </ScrollArea>
  );
};

export { RampsView };
