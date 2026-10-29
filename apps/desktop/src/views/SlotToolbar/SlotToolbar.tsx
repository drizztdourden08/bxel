/* @layer renderer-app @kind component */
import { Box, Toolbar } from '@drizztdourden08/tessera';
import type { SlotToolbarProps } from './SlotToolbar.type';
import './SlotToolbar.css';

const SlotToolbar = ({ label, items, slot, columns }: SlotToolbarProps) =>
  items.length === 0 ? null : (
    <Box className="slot-toolbar">
      <Toolbar label={label} items={items} labels={slot.labels} orientation={slot.orientation} menuSide={slot.menuSide} columns={columns} handle handleProps={slot.handle} />
    </Box>
  );

export { SlotToolbar };
