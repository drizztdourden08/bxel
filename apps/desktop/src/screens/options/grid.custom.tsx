/* @layer renderer-app @kind component */
import type { ScreenMeta, SearchEntrySeed } from '@drizztdourden08/brock-react';
import { GRID_SECTIONS } from '../../canvas-look/grid-sections.constants';
import { CanvasPreview } from '../../views/CanvasPreview';
import { SettingsSplit } from '../../views/SettingsSplit';

const meta: ScreenMeta = {
  title: 'Grid and rulers',
  icon: 'pixel-grid',
  order: 2,
  keywords: ['grid', 'pixel grid', 'major grid', 'tile grid', 'ruler', 'rulers', 'lines', 'opacity', 'preview'],
};

const searchEntries: SearchEntrySeed[] = [
  { label: 'Pixel grid', anchor: 'gridPixel', keywords: ['grid', 'lines', 'zoom', 'colour', 'opacity'] },
  { label: 'Major grid', anchor: 'gridMajor', keywords: ['grid', 'spacing', 'lines', 'colour', 'opacity'] },
  { label: 'Tile grid', anchor: 'gridTile', keywords: ['grid', 'tile', 'size', 'lines', 'colour', 'opacity'] },
  { label: 'Guide colour', anchor: 'guideColor', keywords: ['guides', 'colour', 'rulers', 'lines'] },
  { label: 'Show rulers', anchor: 'rulers', keywords: ['rulers', 'coordinates', 'mirror', 'guides'] },
  { label: 'Ruler units', anchor: 'rulerUnit', keywords: ['rulers', 'units', 'pixels', 'tiles', 'percent'] },
];

const GridScreen = () => <SettingsSplit sections={GRID_SECTIONS} preview={<CanvasPreview kind="grid" />} />;

export default GridScreen;
export { meta, searchEntries };
