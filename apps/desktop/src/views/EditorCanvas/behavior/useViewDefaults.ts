/* @layer renderer-app @kind hook */
import { useSettings } from '@drizztdourden08/brock-react';
import { useEffect } from 'react';
import { CANVAS_DEFAULTS } from '../../../canvas-look/canvas-look.constants';
import { colourOr } from '../../../canvas-look/colour-or';
import type { AppSettings } from '../../../settings.type';
import { useViewStore } from '../../../stores/useViewStore';

const useViewDefaults = (): void => {
  const { settings } = useSettings<AppSettings>();
  const { gridPixel, gridMajor, gridTile, rulers } = settings;
  const guideColour = colourOr(settings.guideColor, CANVAS_DEFAULTS.guideColor);
  useEffect(() => {
    useViewStore.getState().setToggles({ grid: gridPixel, gridMajor, gridTile, rulers });
  }, [gridPixel, gridMajor, gridTile, rulers]);
  useEffect(() => {
    useViewStore.getState().setGuideColour(guideColour);
  }, [guideColour]);
};

export { useViewDefaults };
