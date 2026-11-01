/* @layer renderer-app @kind component */
import { Box, SplitPane } from '@drizztdourden08/tessera';
import { CANVAS_CLASS, EDITOR_CANVAS_TEXT } from '../EditorCanvas.constants';
import type { SplitCanvasProps } from './SplitCanvas.type';

const SplitCanvas = ({ first, second }: SplitCanvasProps) => (
  <SplitPane
    orientation="horizontal"
    defaultRatio={0.5}
    minRatio={0.2}
    maxRatio={0.8}
    startLabel={EDITOR_CANVAS_TEXT.label}
    endLabel={EDITOR_CANVAS_TEXT.splitLabel}
    className={CANVAS_CLASS.split}
    start={<Box className={CANVAS_CLASS.pane}>{first}</Box>}
    end={<Box className={CANVAS_CLASS.pane}>{second}</Box>}
  />
);

export { SplitCanvas };
