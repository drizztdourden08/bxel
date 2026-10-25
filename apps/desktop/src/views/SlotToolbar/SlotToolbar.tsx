/* @layer renderer-app @kind component */
import { focusRegion } from '@drizztdourden08/brock-react';
import { Box, Toolbar } from '@drizztdourden08/tessera';
import { SLOT_REGION_ROLE } from './SlotToolbar.constants';
import type { SlotToolbarProps } from './SlotToolbar.type';
import './SlotToolbar.css';

const SlotToolbar = ({ label, items, slot }: SlotToolbarProps) => (
  <Box className="slot-toolbar" {...focusRegion(label, label, { role: SLOT_REGION_ROLE })}>
    <Toolbar label={label} items={items} orientation={slot.orientation} handle handleProps={slot.handle} />
  </Box>
);

export { SlotToolbar };
