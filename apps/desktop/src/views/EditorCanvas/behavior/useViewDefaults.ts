/* @layer renderer-app @kind hook */
import { useSettings } from '@drizztdourden08/brock-react';
import { useEffect } from 'react';
import type { AppSettings } from '../../../settings.type';
import { useViewStore } from '../../../stores/useViewStore';

const useViewDefaults = (): void => {
  const { settings } = useSettings<AppSettings>();
  const { gridPixel, gridMajor, gridTile, rulers } = settings;
  useEffect(() => {
    useViewStore.getState().setToggles({ grid: gridPixel, gridMajor, gridTile, rulers });
  }, [gridPixel, gridMajor, gridTile, rulers]);
};

export { useViewDefaults };
