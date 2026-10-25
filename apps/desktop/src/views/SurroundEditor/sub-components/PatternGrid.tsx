/* @layer renderer-app @kind component */
import { focusRegion } from '@drizztdourden08/brock-react';
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
      {...focusRegion(SURROUND_EDITOR_TEXT.editorLabel, SURROUND_EDITOR_TEXT.editorLabel, { role: 'application' })}
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
