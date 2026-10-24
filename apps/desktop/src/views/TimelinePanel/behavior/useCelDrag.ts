/* @layer renderer-app @kind hook */
import { useRef, useState } from 'react';
import type { CelKey } from '../../../stores/timeline-store.type';
import { celKeyText } from '../../../timeline/cel-key-text';
import { dragCels } from '../../../timeline/drag-cels';
import type { CelDrag, CelDragHandlers } from '../TimelinePanel.type';

const useCelDrag = (): CelDrag => {
  const from = useRef<CelKey | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const finish = (): void => {
    from.current = null;
    setOver(null);
  };
  const handlers = (key: CelKey, draggable: boolean): CelDragHandlers => ({
    draggable,
    onDragStart: (event) => {
      from.current = key;
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', celKeyText(key));
    },
    onDragOver: (event) => {
      if (from.current === null) return;
      event.preventDefault();
      setOver(celKeyText(key));
    },
    onDrop: (event) => {
      event.preventDefault();
      const start = from.current;
      finish();
      if (start) dragCels(start, key);
    },
    onDragEnd: finish,
  });
  return { over, handlers };
};

export { useCelDrag };
