/* @layer renderer-app @kind hook */
import { useEffect, useRef, useState } from 'react';
import { HUD_SHOW_MS } from '../CanvasOverlays.constants';

const useHudVisible = (zoom: number): boolean => {
  const [visible, setVisible] = useState(false);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return undefined;
    }
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), HUD_SHOW_MS);
    return () => window.clearTimeout(timer);
  }, [zoom]);
  return visible;
};

export { useHudVisible };
