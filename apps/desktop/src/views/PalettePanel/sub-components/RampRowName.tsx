/* @layer renderer-app @kind component */
import { Box, InlineEdit, Text } from '@drizztdourden08/tessera';
import type { RefObject } from 'react';
import { editRamp } from '../../../palette-ramps/edit-ramp';
import { reportOutcome } from '../behavior/report-outcome';
import { PALETTE_PANEL_TEXT, RAMP_ROW_TEXT } from '../PalettePanel.constants';
import type { RampRowProps } from '../PalettePanel.type';

const RampRowName = ({ panel, ramp, nameRef }: Pick<RampRowProps, 'panel' | 'ramp'> & { nameRef: RefObject<HTMLElement | null> }) => (
  <Box ref={nameRef} className="ramp-row__name">
    {ramp && !panel.lock.locked ? (
      <InlineEdit size="sm" label={RAMP_ROW_TEXT.name(ramp.name)} value={ramp.name} onCommit={(next) => reportOutcome(editRamp(panel.target, ramp.id, { name: next }))} />
    ) : (
      <Text variant="label" tone={ramp ? undefined : 'muted'}>{ramp?.name ?? PALETTE_PANEL_TEXT.notInRamp}</Text>
    )}
  </Box>
);

export { RampRowName };
