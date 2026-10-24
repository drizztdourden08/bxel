/* @layer renderer-app @kind hook */
import { useEffect, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { FLYOUT_CLOSE_DELAY } from '../ToolRail.constants';
import type { FlyoutOpen } from '../ToolRail.type';

const useFlyoutOpen = (): FlyoutOpen => {
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    if (!leaving) return undefined;
    const timer = window.setTimeout(() => {
      setOpen(false);
      setLeaving(false);
    }, FLYOUT_CLOSE_DELAY);
    return () => window.clearTimeout(timer);
  }, [leaving]);
  const show = (): void => {
    setLeaving(false);
    setOpen(true);
  };
  const close = (): void => {
    setLeaving(false);
    setOpen(false);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLElement>): void => {
    if (event.key === 'Escape') close();
  };
  const handlers = { onMouseEnter: show, onMouseLeave: () => setLeaving(true), onFocus: show, onBlur: () => setLeaving(true), onKeyDown };
  return { open, close, handlers };
};

export { useFlyoutOpen };
