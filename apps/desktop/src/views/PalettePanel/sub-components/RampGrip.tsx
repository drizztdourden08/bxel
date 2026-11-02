/* @layer renderer-app @kind component */
import { Button, Icon } from '@drizztdourden08/tessera';
import { RAMP_ROW_TEXT } from '../PalettePanel.constants';
import type { RampGripProps } from '../PalettePanel.type';

const RampGrip = ({ reorder, position, ramp }: RampGripProps) => (
  <Button
    size="xs"
    variant="tertiary"
    className="ramp-row__grip"
    aria-label={RAMP_ROW_TEXT.grip(ramp.name)}
    icon={<Icon name="grip-vertical" size={14} />}
    {...reorder.drag.handlers(position)}
  />
);

export { RampGrip };
