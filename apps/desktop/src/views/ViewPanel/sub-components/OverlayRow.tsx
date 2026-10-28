/* @layer renderer-app @kind component */
import { Flex, Toggle } from '@drizztdourden08/tessera';
import type { OverlayRowProps } from '../ViewPanel.type';
import { LineSwatch } from './LineSwatch';

const OverlayRow = ({ label, description, checked, disabled, swatch, onChange }: OverlayRowProps) => (
  <Flex gap="sm" align="center" className="view-panel__row">
    <Toggle size="sm" label={label} description={description} checked={checked} disabled={disabled} onChange={onChange} />
    {swatch && <LineSwatch {...swatch} />}
  </Flex>
);

export { OverlayRow };
