/* @layer renderer-app @kind component */
import type { ScreenMeta, SearchEntrySeed } from '@drizztdourden08/brock-react';
import { SURROUND_SECTIONS } from '../../canvas-look/surround-sections.constants';
import { CanvasPreview } from '../../views/CanvasPreview';
import { SettingsSplit } from '../../views/SettingsSplit';

const meta: ScreenMeta = {
  title: 'Surround pattern',
  icon: 'layers',
  order: 2.2,
  keywords: ['surround', 'pattern', 'background', 'stripes', 'dots', 'custom', 'texture', 'preview'],
};

const searchEntries: SearchEntrySeed[] = [
  { label: 'Surround pattern', anchor: 'surroundPattern', keywords: ['surround', 'texture', 'stripes', 'dots', 'background'] },
  { label: 'Surround colours', anchor: 'surroundA', keywords: ['surround', 'colour', 'background'] },
  { label: 'Surround pattern size', anchor: 'surroundScale', keywords: ['surround', 'scale', 'coarse'] },
  { label: 'Custom pattern', anchor: 'canvas.surroundCustom', keywords: ['surround', 'draw', 'custom', 'cells'] },
];

const SurroundScreen = () => <SettingsSplit sections={SURROUND_SECTIONS} preview={<CanvasPreview kind="surround" />} />;

export default SurroundScreen;
export { meta, searchEntries };
