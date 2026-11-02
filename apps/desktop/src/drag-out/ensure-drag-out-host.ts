/* @layer renderer-app @kind logic */
import { dragOut, setDragOutHost } from '@drizztdourden08/brock-react';

let ready = false;

const ensureDragOutHost = (): void => {
  if (ready) return;
  ready = true;
  setDragOutHost({
    start: async (paths) => {
      await dragOut([...paths]);
      return true;
    },
  });
};

export { ensureDragOutHost };
