/* @layer renderer-app @kind component */
import { SlotToolbar } from '../SlotToolbar';
import { useCanvasItems } from './behavior/useCanvasItems';
import { CANVAS_TEXT } from './CanvasToolbar.constants';
import type { CanvasToolbarProps } from './CanvasToolbar.type';

const CanvasToolbar = ({ slot }: CanvasToolbarProps) => {
  const items = useCanvasItems();
  return <SlotToolbar label={CANVAS_TEXT.region} items={items} slot={slot} />;
};

export { CanvasToolbar };
