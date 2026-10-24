/* @layer renderer-app @kind hook */
import { DEFAULT_LISTED_KINDS } from '@bxel/project';
import { useCallback, useEffect, useState } from 'react';
import { fileKit } from '../../../files/file-kit';
import { reasonOf } from '../../../files/reason-of';
import { listFolderEntries } from '../../../project/list-folder-entries';
import { PANEL_LIST_LIMIT } from '../../../project/project.constants';
import { watchFolder } from '../../../project/watch-folder';
import { EMPTY_LISTING } from '../ProjectPanel.constants';
import type { ListingState } from '../ProjectPanel.type';

const useProjectListing = (dir: string | null): ListingState & { readonly refresh: () => void } => {
  const [state, setState] = useState<ListingState>(EMPTY_LISTING);
  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick((value) => value + 1), []);

  useEffect(() => {
    const kit = fileKit();
    return dir === null || !kit ? undefined : watchFolder(kit.documents, dir, refresh);
  }, [dir, refresh]);

  useEffect(() => {
    const kit = fileKit();
    if (dir === null || !kit) {
      setState(EMPTY_LISTING);
      return undefined;
    }
    let live = true;
    const options = { kinds: DEFAULT_LISTED_KINDS, offset: 0, limit: PANEL_LIST_LIMIT };
    listFolderEntries(kit.documents, dir, options).then(
      (listing) => live && setState({ listing, error: null }),
      (failure: unknown) => live && setState({ listing: null, error: reasonOf(failure) }),
    );
    return () => {
      live = false;
    };
  }, [dir, tick]);

  return { ...state, refresh };
};

export { useProjectListing };
