/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { useProjectSetsStore } from '../stores/useProjectSetsStore';
import { buildLibrary } from './build-library';
import type { SwatchLibrary } from './swatch-library.type';
import { useUserSets } from './useUserSets';

const useSwatchLibrary = (): SwatchLibrary => {
  const { sets: user } = useUserSets();
  const project = useProjectSetsStore((state) => state.sets);
  return useMemo(() => buildLibrary(user, project), [user, project]);
};

export { useSwatchLibrary };
