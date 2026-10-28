/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { watchRoots } from '../asset-list/watch-roots';
import { fileKit } from '../files/file-kit';
import type { OpenProject } from '../project/project.type';
import { listProjectTree } from './list-project-tree';
import type { ProjectTree } from './project-browser.type';

const NOTHING: ProjectTree = { files: [], folders: [] };

/** The files and folders on disk under the granted roots of the open project, kept current by the folder watcher. */
const useProjectTree = (project: OpenProject | null): { readonly tree: ProjectTree; readonly refresh: () => void } => {
  const [tree, setTree] = useState<ProjectTree>(NOTHING);
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
      setTree(NOTHING);
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
