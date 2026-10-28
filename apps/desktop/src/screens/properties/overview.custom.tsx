/* @layer renderer-app @kind component */
import type { ScreenMeta, SearchEntrySeed } from '@drizztdourden08/brock-react';
import { showForKind } from '../../asset-config/show-for-kind';
import { AssetOverview } from '../../views/AssetOverview';

const meta: ScreenMeta = {
  title: 'Overview',
  showHeader: true,
  icon: 'layout-dashboard',
  order: 0,
  when: showForKind('sprite', 'animation', 'sheet', 'palette', 'tileset', 'tilemap'),
  keywords: ['overview', 'preview', 'name', 'rename', 'file', 'path', 'size', 'colours', 'created', 'links', 'uses', 'used by'],
};

const searchEntries: SearchEntrySeed[] = [
  { label: 'Asset overview', keywords: ['preview', 'metadata', 'name', 'file size', 'colour count', 'created'] },
];

const OverviewScreen = () => <AssetOverview />;

export default OverviewScreen;
export { meta, searchEntries };
