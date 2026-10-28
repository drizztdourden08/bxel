/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { watchRoots } from '../asset-list/watch-roots';
import { fileKit } from '../files/file-kit';
import type { OpenProject } from '../project/project.type';
import { listBrowserEntries } from './list-browser-entries';
import { NO_LISTING } from './project-browser.constants';
import type { BrowserRoot, BrowserSource, ListedEntries } from './project-browser.type';

const rootsOf = (project: OpenProject | null): readonly BrowserRoot[] =>
  (project?.folders ?? []).map((folder, index) => ({ path: folder.path, name: folder.name, main: index === 0, granted: folder.granted }));

const useBrowserSource = (project: OpenProject | null): BrowserSource => {
  const folders = project?.folders;
  const roots = useMemo(() => rootsOf(project), [project]);
  const [listed, setListed] = useState<ListedEntries>(NO_LISTING);
  const [ready, setReady] = useState(false);
  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick((value) => value + 1), []);
  const watched = useMemo(() => (folders ?? []).filter((folder) => folder.granted).map((folder) => folder.path), [folders]);
  const watchKey = watched.join('|');

  useEffect(() => {
    const kit = fileKit();
    return kit && watchKey !== '' ? watchRoots(kit.documents, watchKey.split('|'), refresh) : undefined;
  }, [watchKey, refresh]);

  useEffect(() => {
    const kit = fileKit();
    if (!kit || roots.length === 0) {
      setListed(NO_LISTING);
      setReady(false);
      return undefined;
    }
    let live = true;
    void listBrowserEntries(kit.documents, roots).then((found) => {
      if (!live) return;
      setListed(found);
      setReady(true);
    });
    return () => {
      live = false;
    };
  }, [roots, tick]);

  return { roots, ...listed, ready, refresh };
};

export { useBrowserSource };
