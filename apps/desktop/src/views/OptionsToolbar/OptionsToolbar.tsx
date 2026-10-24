/* @layer renderer-app @kind component */
import { SlotToolbar } from '../SlotToolbar';
import { useOptionsItems } from './behavior/useOptionsItems';
import { OPTIONS_TEXT } from './OptionsToolbar.constants';
import type { OptionsToolbarProps } from './OptionsToolbar.type';

const OptionsToolbar = ({ slot }: OptionsToolbarProps) => {
  const items = useOptionsItems();
  return <SlotToolbar label={OPTIONS_TEXT.region} items={items} slot={slot} />;
};

export { OptionsToolbar };
