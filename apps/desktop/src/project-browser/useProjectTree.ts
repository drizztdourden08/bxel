/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { watchRoots } from '../asset-list/watch-roots';
import { fileKit } from '../files/file-kit';
import type { OpenProject } from '../project/project.type';
import { listProjectTree } from './list-project-tree';
import { NO_TREE } from './project-browser.constants';
import type { ProjectTree } from './project-browser.type';

const useProjectTree = (project: OpenProject | null): { readonly tree: ProjectTree; readonly refresh: () => void } => {
  const [tree, setTree] = useState<ProjectTree>(NO_TREE);
  const [tick, setTick] = useState(0);
  const roots = useMemo(() => project?.folders.filter((folder) => folder.granted).map((folder) => folder.path) ?? [], [project]);
  const key = roots.join('|');
  const refresh = useCallback(() => setTick((value) => value + 1), []);

  useEffect(() => {
    const kit = fileKit();
    return kit && key !== '' ? watchRoots(kit.documents, key.split('|'), refresh) : undefined;
  }, [key, refresh]);

  useEffect(() => {
    const kit = fileKit();
    if (!kit || key === '') {
      setTree(NO_TREE);
      return undefined;
    }
    let live = true;
    void listProjectTree(kit.documents, key.split('|')).then((found) => live && setTree(found));
    return () => {
      live = false;
    };
  }, [key, tick]);

  return { tree, refresh };
};

export { useProjectTree };
