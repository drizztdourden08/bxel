/* @layer renderer-app @kind component */
import type { ScreenMeta, SearchEntrySeed } from '@drizztdourden08/brock-react';
import { CANVAS_SECTIONS } from '../../canvas-look/canvas-sections.constants';
import { CanvasPreview } from '../../views/CanvasPreview';
import { SettingsSplit } from '../../views/SettingsSplit';

const meta: ScreenMeta = {
  title: 'Canvas',
  icon: 'image',
  order: 2.4,
  keywords: ['canvas', 'checkerboard', 'transparency', 'transparent', 'cell size', 'preview', 'sixteen', 'right click', 'context menu'],
};

const searchEntries: SearchEntrySeed[] = [
  { label: 'Checkerboard colours', anchor: 'checkerA', keywords: ['canvas', 'transparency', 'transparent', 'colour'] },
  { label: 'Checkerboard cell size', anchor: 'checkerPreset', keywords: ['canvas', 'transparency', 'size', 'cell'] },
  { label: 'Right click on the canvas', anchor: 'canvasRightClick', keywords: ['canvas', 'context menu', 'back colour', 'palette', 'mouse'] },
];

const CanvasScreen = () => <SettingsSplit sections={CANVAS_SECTIONS} preview={<CanvasPreview kind="canvas" />} />;

export default CanvasScreen;
export { meta, searchEntries };
