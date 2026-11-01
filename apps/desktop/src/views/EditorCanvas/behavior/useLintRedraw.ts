/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import type { RefObject } from 'react';
import type { EditorTarget } from '../../../editor/editor.type';
import { useLintStore } from '../../../stores/useLintStore';
import type { PixelViewportHandle } from '../../PixelViewport';

const useLintRedraw = (viewport: RefObject<PixelViewportHandle | null>, target: EditorTarget | null): void => {
  const shown = useLintStore((state) => state.shown);
  const sprite = target?.sprite;
  useEffect(() => {
    viewport.current?.redraw();
  }, [viewport, shown, sprite, target?.frameId]);
};

export { useLintRedraw };
