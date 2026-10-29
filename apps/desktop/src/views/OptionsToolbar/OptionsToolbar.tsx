/* @layer renderer-app @kind component */
import { contextMenuZone, useContextMenu } from '@drizztdourden08/brock-react';
import { Box } from '@drizztdourden08/tessera';
import { usePendingStore } from '../../stores/usePendingStore';
import { SlotToolbar } from '../SlotToolbar';
import { TransformBar } from '../TransformBar';
import { optionsEntries } from './behavior/options-entries';
import { useOptionsItems } from './behavior/useOptionsItems';
import { OPTIONS_TEXT } from './OptionsToolbar.constants';
import type { OptionsToolbarProps } from './OptionsToolbar.type';
import './OptionsToolbar.css';

const OptionsToolbar = ({ slot }: OptionsToolbarProps) => {
  const items = useOptionsItems();
  const transforming = usePendingStore((state) => state.pending?.spec.kind === 'transform');
  useContextMenu(OPTIONS_TEXT.zone, { entries: optionsEntries, label: OPTIONS_TEXT.menuLabel, inherit: 'parent' });
  return (
    <Box className="options-bar" {...contextMenuZone(OPTIONS_TEXT.zone)}>
      {transforming ? <TransformBar /> : <SlotToolbar label={OPTIONS_TEXT.region} items={items} slot={slot} />}
    </Box>
  );
};

export { OptionsToolbar };
