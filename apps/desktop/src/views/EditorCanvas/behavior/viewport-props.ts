/* @layer renderer-app @kind logic */
import { stepFrame } from '../../../timeline/step-frame';
import { WRAP_OF } from '../../../editor/wrap.constants';
import { EDITOR_CANVAS_TEXT } from '../EditorCanvas.constants';
import { viewportClass } from './viewport-class';
import type { ViewportPropsInput } from './viewport-props.type';

const viewportProps = ({ tool, size, source, look, flags, onKeyDown }: ViewportPropsInput) => ({
  className: viewportClass(tool),
  label: EDITOR_CANVAS_TEXT.label,
  hint: EDITOR_CANVAS_TEXT.hint,
  width: size.width,
  height: size.height,
  source,
  look,
  grid: flags.grid,
  gridMajor: flags.gridMajor,
  gridTile: flags.gridTile,
  gridIso: flags.gridIso,
  mirror: flags.mirror,
  onAltWheel: stepFrame,
  hand: tool === 'hand',
  tiled: WRAP_OF[flags.tiled],
  onKeyDown,
});

export { viewportProps };
