/* @layer renderer-app @kind component */
import { Box } from '@drizztdourden08/tessera';
import { CanvasRuler, useRulerMenu } from '../../CanvasRuler';

const RulerBars = () => {
  useRulerMenu();
  return (
    <>
      <Box className="editor-canvas__corner" />
      <CanvasRuler axis="x" />
      <CanvasRuler axis="y" />
    </>
  );
};

export { RulerBars };
