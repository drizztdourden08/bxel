/* @layer renderer-app @kind hook */
import { useEffect, useState } from 'react';

const carriesFiles = (event: DragEvent): boolean => event.dataTransfer?.types.includes('Files') === true;

const useFileDrag = (): boolean => {
  const [dragging, setDragging] = useState(false);
  useEffect(() => {
    const enter = (event: DragEvent): void => {
      if (carriesFiles(event)) setDragging(true);
    };
    const leave = (event: DragEvent): void => {
      if (event.relatedTarget === null) setDragging(false);
    };
    const stop = (): void => setDragging(false);
    window.addEventListener('dragenter', enter, true);
    window.addEventListener('dragleave', leave, true);
    window.addEventListener('drop', stop, true);
    window.addEventListener('dragend', stop, true);
    return () => {
      window.removeEventListener('dragenter', enter, true);
      window.removeEventListener('dragleave', leave, true);
      window.removeEventListener('drop', stop, true);
      window.removeEventListener('dragend', stop, true);
    };
  }, []);
  return dragging;
};

export { useFileDrag };
