/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import { useToolStore } from '../stores/useToolStore';
import { useCatalogueSurface } from './useCatalogueSurface';

const useToolSurface = (): void => {
  const surface = useCatalogueSurface();
  useEffect(() => useToolStore.getState().enterSurface(surface), [surface]);
};

export { useToolSurface };
