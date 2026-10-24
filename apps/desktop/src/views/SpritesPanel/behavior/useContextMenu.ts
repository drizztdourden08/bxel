/* @layer renderer-app @kind hook */
import { useRef, useState } from 'react';
import type { ContextMenuState } from '../SpritesPanel.type';

const useContextMenu = (): ContextMenuState => {
  const anchor = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  return {
    open,
    anchor,
    show: (event) => {
      event.preventDefault();
      anchor.current = event.currentTarget;
      setOpen(true);
    },
    hide: () => setOpen(false),
  };
};

export { useContextMenu };
