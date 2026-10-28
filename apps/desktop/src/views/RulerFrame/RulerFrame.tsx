/* @layer renderer-app @kind component */
import { Box } from '@drizztdourden08/tessera';
import type { ReactNode } from 'react';
import { useViewStore } from '../../stores/useViewStore';
import { canvasClass } from '../EditorCanvas/behavior/canvas-class';
import { RulerBars } from '../EditorCanvas/sub-components/RulerBars';

const RulerFrame = ({ children }: { children: ReactNode }) => {
  const rulers = useViewStore((state) => state.rulers);
  return (
    <Box className={canvasClass(rulers)}>
      {rulers && <RulerBars />}
      {children}
    </Box>
  );
};

export { RulerFrame };
