/* @layer renderer-app @kind hook */
import type { RefObject } from 'react';
import type { EditorTarget } from '../../../editor/editor.type';
import type { PixelViewportHandle } from '../../PixelViewport';
import { useAreaRedraw } from './useAreaRedraw';
import { useGuideRedraw } from './useGuideRedraw';
import { useLintRedraw } from './useLintRedraw';
import { useMarchingAnts } from './useMarchingAnts';

const useCanvasRedraws = (
  viewport: RefObject<PixelViewportHandle | null>,
  second: RefObject<PixelViewportHandle | null>,
  target: EditorTarget | null,
): void => {
  useMarchingAnts(viewport);
  useAreaRedraw(viewport);
  useGuideRedraw(viewport, target);
  useLintRedraw(viewport, target);
  useMarchingAnts(second);
  useAreaRedraw(second);
  useGuideRedraw(second, target);
};

export { useCanvasRedraws };
