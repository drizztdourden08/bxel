/* @layer renderer-app @kind component */
import { Box, Flex } from '@drizztdourden08/tessera';
import { useState } from 'react';
import { dropMembership } from '../behavior/drop-membership';
import { rampRowData } from '../behavior/ramp-row-data';
import { rampRowKeys } from '../behavior/ramp-row-keys';
import { PALETTE_PANEL_TEXT } from '../PalettePanel.constants';
import type { RampRowProps } from '../PalettePanel.type';
import { RampRowHead } from './RampRowHead';
import { RampSwatch } from './RampSwatch';

const RampRow = ({ panel, ramp, indices, reorder, position = 0 }: RampRowProps) => {
  const [over, setOver] = useState(false);
  const rampId = ramp?.id ?? null;
  return (
    <Box
      surface="raised"
      className={over ? 'ramp-row ramp-row--over' : 'ramp-row'}
      role="group"
      aria-label={ramp?.name ?? PALETTE_PANEL_TEXT.notInRamp}
      {...rampRowData(ramp, reorder, position)}
      onKeyDown={rampRowKeys(panel, ramp, reorder, position)}
      onDragOver={(event) => {
        event.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(event) => {
        setOver(false);
        dropMembership(panel, rampId, event);
      }}
    >
      <RampRowHead panel={panel} ramp={ramp} indices={indices} reorder={reorder} position={position} />
      <Flex gap="2xs" wrap className="ramp-row__swatches">
        {indices.map((index) => (
          <RampSwatch key={index} panel={panel} index={index} from={rampId} />
        ))}
      </Flex>
    </Box>
  );
};

export { RampRow };
