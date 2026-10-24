/* @layer renderer-app @kind hook */
import { toast } from '@drizztdourden08/brock-react';
import { useCallback, useMemo, useState } from 'react';
import { useEditorTarget } from '../../../hooks/useEditorTarget';
import { useDocumentStore } from '../../../stores/useDocumentStore';
import { findLibrarySet } from '../../../swatch-library/find-library-set';
import { runLoad } from '../../../swatch-library/run-load';
import { setSelectGroups } from '../../../swatch-library/set-select-groups';
import type { LoadMode } from '../../../swatch-library/swatch-library.type';
import { useSwatchLibrary } from '../../../swatch-library/useSwatchLibrary';
import type { SetLoaderModel } from '../PalettePanel.type';

const useSetLoader = (): SetLoaderModel => {
  const library = useSwatchLibrary();
  const target = useEditorTarget();
  const [chosen, setChosen] = useState('');
  const groups = useMemo(() => setSelectGroups(library.groups), [library]);
  const set = findLibrarySet(library, chosen);

  const load = useCallback(
    (mode: LoadMode): void => {
      if (!set || !target) return;
      const outcome = runLoad(useDocumentStore.getState().host, { documentId: target.documentId, bankId: target.bank.id, set, mode });
      toast(outcome.message, { variant: outcome.ok ? 'success' : 'info' });
    },
    [set, target],
  );

  return { groups, value: set ? chosen : '', empty: set === null, choose: setChosen, load };
};

export { useSetLoader };
