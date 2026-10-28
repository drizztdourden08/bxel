/* @layer renderer-app @kind hook */
import { useEffect, useState } from 'react';
import { activeEntryDrag } from '../../../sheet-manager/drag-payload';

/** True while entries of the sheet are being dragged, so the drawer can offer itself as a drop target. */
const useSheetDragging = (): boolean => {
  const [dragging, setDragging] = useState(false);
  useEffect(() => {
    const sync = (): void => setDragging(activeEntryDrag()?.source === 'sheet');
    const stop = (): void => setDragging(false);
    window.addEventListener('dragstart', sync);
    window.addEventListener('dragend', stop);
    window.addEventListener('drop', stop);
    return () => {
      window.removeEventListener('dragstart', sync);
      window.removeEventListener('dragend', stop);
      window.removeEventListener('drop', stop);
    };
  }, []);
  return dragging;
};

export { useSheetDragging };
