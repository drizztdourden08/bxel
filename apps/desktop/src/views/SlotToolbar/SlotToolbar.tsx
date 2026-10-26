/* @layer renderer-app @kind component */
import { Box, Toolbar } from '@drizztdourden08/tessera';
import type { SlotToolbarProps } from './SlotToolbar.type';
import './SlotToolbar.css';

const SlotToolbar = ({ label, items, slot }: SlotToolbarProps) => (
  <Box className="slot-toolbar">
    <Toolbar label={label} items={items} orientation={slot.orientation} handle handleProps={slot.handle} />
  </Box>
);

export { SlotToolbar };
