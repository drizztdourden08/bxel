/* @layer renderer-app @kind component */
import { Toolbar } from '@drizztdourden08/tessera';
import type { SlotToolbarProps } from './SlotToolbar.type';

const SlotToolbar = ({ label, items, slot }: SlotToolbarProps) => (
  <Toolbar label={label} items={items} orientation={slot.orientation} handle handleProps={slot.handle} />
);

export { SlotToolbar };
