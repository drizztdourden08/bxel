/* @layer renderer-app @kind hook */
import type { RefObject } from 'react';
import { useEditorTarget } from '../../../hooks/useEditorTarget';
import { useEscapeCancel } from '../../EditorCanvas/behavior/useEscapeCancel';
import { useGuideRedraw } from '../../EditorCanvas/behavior/useGuideRedraw';
import { useRulerUnits } from '../../EditorCanvas/behavior/useRulerUnits';
import { useSyncPending } from '../../EditorCanvas/behavior/useSyncPending';
import { useViewDefaults } from '../../EditorCanvas/behavior/useViewDefaults';
import type { PixelViewportHandle } from '../../PixelViewport';
import { useSelectionReset } from './useSelectionReset';

const useMapSurfaceSetup = (viewport: RefObject<PixelViewportHandle | null>): void => {
  useViewDefaults();
  useRulerUnits();
  useGuideRedraw(viewport, null);
  useSyncPending(useEditorTarget());
  useEscapeCancel();
  useSelectionReset();
};

export { useMapSurfaceSetup };
