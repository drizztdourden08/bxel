/* @layer renderer-app @kind component */
import { Box } from '@drizztdourden08/tessera';
import { CanvasRuler } from '../../CanvasRuler';

const RulerBars = () => (
  <>
    <Box className="editor-canvas__corner" />
    <CanvasRuler axis="x" />
    <CanvasRuler axis="y" />
  </>
);

export { RulerBars };
