/* @layer renderer-app @kind component */
import { contextMenuZone, useContextMenu } from '@drizztdourden08/brock-react';
import { Box } from '@drizztdourden08/tessera';
import { SlotToolbar } from '../SlotToolbar';
import { optionsEntries } from './behavior/options-entries';
import { useOptionsItems } from './behavior/useOptionsItems';
import { OPTIONS_TEXT } from './OptionsToolbar.constants';
import type { OptionsToolbarProps } from './OptionsToolbar.type';
import './OptionsToolbar.css';

const OptionsToolbar = ({ slot }: OptionsToolbarProps) => {
  const items = useOptionsItems();
  useContextMenu(OPTIONS_TEXT.zone, { entries: optionsEntries, label: OPTIONS_TEXT.menuLabel, inherit: 'parent' });
  return (
    <Box className="options-bar" {...contextMenuZone(OPTIONS_TEXT.zone)}>
      <SlotToolbar label={OPTIONS_TEXT.region} items={items} slot={slot} />
    </Box>
  );
};

export { OptionsToolbar };
