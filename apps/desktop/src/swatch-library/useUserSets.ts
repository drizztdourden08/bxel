/* @layer renderer-app @kind hook */
import { parseSwatchSets, removeSwatchSet, upsertSwatchSet } from '@bxel/project';
import type { ProjectResult, SwatchSet, SwatchSetId } from '@bxel/project';
import { useSettings } from '@drizztdourden08/brock-react';
import { useCallback, useMemo } from 'react';
import type { AppSettings } from '../settings.type';
import type { UserSets } from './swatch-library.type';

const useUserSets = (): UserSets => {
  const { settings, patch } = useSettings<AppSettings>();
  const sets = useMemo(() => parseSwatchSets(settings.swatchSets), [settings.swatchSets]);

  const save = useCallback(
    (set: SwatchSet): ProjectResult<readonly SwatchSet[]> => {
      const result = upsertSwatchSet(sets, set);
      if (result.ok) patch({ swatchSets: result.value });
      return result;
    },
    [patch, sets],
  );

  const remove = useCallback((setId: SwatchSetId): void => patch({ swatchSets: removeSwatchSet(sets, setId) }), [patch, sets]);

  return { sets, save, remove };
};

export { useUserSets };
