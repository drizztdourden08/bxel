/* @layer renderer-app @kind hook */
import { toast } from '@drizztdourden08/brock-react';
import { useCallback, useMemo, useState } from 'react';
import { focusBank } from '../../../asset-config/focus-bank';
import { useAssetFocus } from '../../../asset-config/useAssetFocus';
import { useDocumentStore } from '../../../stores/useDocumentStore';
import { findLibrarySet } from '../../../swatch-library/find-library-set';
import { runLoad } from '../../../swatch-library/run-load';
import { setSelectGroups } from '../../../swatch-library/set-select-groups';
import type { LoadMode } from '../../../swatch-library/swatch-library.type';
import { useSwatchLibrary } from '../../../swatch-library/useSwatchLibrary';
import type { SetLoaderModel } from '../AssetControl.type';

const useSetLoader = (): SetLoaderModel => {
  const library = useSwatchLibrary();
  const focus = useAssetFocus();
  const bank = focus ? focusBank(focus) : undefined;
  const [chosen, setChosen] = useState('');
  const groups = useMemo(() => setSelectGroups(library.groups), [library]);
  const set = findLibrarySet(library, chosen);

  const load = useCallback(
    (mode: LoadMode): void => {
      if (!set || !focus || !bank) return;
      const outcome = runLoad(useDocumentStore.getState().host, { documentId: focus.documentId, bankId: bank.id, set, mode });
      toast(outcome.message, { variant: outcome.ok ? 'success' : 'info' });
    },
    [set, focus, bank],
  );

  return { groups, value: set ? chosen : '', empty: set === null || bank === undefined, choose: setChosen, load };
};

export { useSetLoader };
