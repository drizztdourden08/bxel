/* @layer renderer-app @kind component */
import type { ScreenMeta, SearchEntrySeed } from '@drizztdourden08/brock-react';
import { SwatchSetEditor } from '../../views/SwatchSetEditor';

const meta: ScreenMeta = { title: 'Palette library', showHeader: true, icon: 'palette', order: 4, fill: true, keywords: ['palette', 'colors', 'library', 'import', 'preset', 'swatches'] };

const searchEntries: SearchEntrySeed[] = [
  { label: 'Swatch set library', keywords: ['palette', 'colors', 'import', 'gpl', 'preset', 'project'] },
];

const SwatchesScreen = () => <SwatchSetEditor />;

export default SwatchesScreen;
export { meta, searchEntries };
