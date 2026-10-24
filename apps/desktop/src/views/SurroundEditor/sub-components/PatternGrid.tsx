/* @layer renderer-app @kind component */
import { Box, Canvas } from '@drizztdourden08/tessera';
import { usePatternGrid } from '../behavior/usePatternGrid';
import { SURROUND_EDITOR_TEXT } from '../SurroundEditor.constants';
import type { PatternGridProps } from '../SurroundEditor.type';

const PatternGrid = (props: PatternGridProps) => {
  const grid = usePatternGrid(props);
  return (
    <Box
      ref={grid.boxRef}
      className="surround-editor__grid"
      tabIndex={0}
      role="application"
      aria-label={SURROUND_EDITOR_TEXT.editorLabel}
      onPointerDown={grid.onPointerDown}
      onPointerMove={grid.onPointerMove}
      onPointerUp={grid.onPointerUp}
      onPointerCancel={grid.onPointerUp}
      onKeyDown={grid.onKeyDown}
      onFocus={grid.onFocus}
      onBlur={grid.onBlur}
    >
      <Canvas ref={grid.canvasRef} className="surround-editor__grid-canvas" aria-hidden="true" />
    </Box>
  );
};

export { PatternGrid };
