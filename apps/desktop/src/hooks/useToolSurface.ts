/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import { useToolStore } from '../stores/useToolStore';
import { useSurface } from './useSurface';

const useToolSurface = (): void => {
  const surface = useSurface();
  useEffect(() => useToolStore.getState().enterSurface(surface), [surface]);
};

export { useToolSurface };
