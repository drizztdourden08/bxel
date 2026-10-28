/* @layer renderer-app @kind component */
import type { PanelProps } from '../PalettePanel.type';
import { RampsView } from './RampsView';
import { SwatchGrid } from './SwatchGrid';
import { SwatchList } from './SwatchList';

const SwatchView = ({ panel }: PanelProps) => {
  if (panel.view.view === 'list') return <SwatchList panel={panel} />;
  if (panel.view.view === 'ramps') return <RampsView panel={panel} />;
  return <SwatchGrid panel={panel} />;
};

export { SwatchView };
