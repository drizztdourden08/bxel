/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import type { RefObject } from 'react';
import type { EditorTarget } from '../../../editor/editor.type';
import { useCanvasSizeStore } from '../../../stores/useCanvasSizeStore';
import { useGuideStore } from '../../../stores/useGuideStore';
import { useViewStore } from '../../../stores/useViewStore';
import type { PixelViewportHandle } from '../../PixelViewport';

const useGuideRedraw = (viewport: RefObject<PixelViewportHandle | null>, target: EditorTarget | null): void => {
  useEffect(() => useGuideStore.subscribe(() => viewport.current?.redraw()), [viewport]);
  useEffect(() => useCanvasSizeStore.subscribe(() => viewport.current?.redraw()), [viewport]);
  const guides = target?.sprite.guides;
  const shown = useViewStore((state) => state.guides);
  useEffect(() => {
    viewport.current?.redraw();
  }, [viewport, guides, shown]);
};

export { useGuideRedraw };
