/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import { dropImage } from '../../../image-import/drop-image';
import { isPngFile } from '../../../image-import/is-png-file';

const carriesFiles = (event: DragEvent): boolean => event.dataTransfer?.types.includes('Files') === true;

const useWindowDrop = (): void => {
  useEffect(() => {
    const over = (event: DragEvent): void => {
      if (carriesFiles(event)) event.preventDefault();
    };
    const drop = (event: DragEvent): void => {
      const file = Array.from(event.dataTransfer?.files ?? []).find(isPngFile);
      if (event.defaultPrevented || !file) return;
      event.preventDefault();
      void dropImage(file);
    };
    window.addEventListener('dragover', over);
    window.addEventListener('drop', drop);
    return () => {
      window.removeEventListener('dragover', over);
      window.removeEventListener('drop', drop);
    };
  }, []);
};

export { useWindowDrop };
