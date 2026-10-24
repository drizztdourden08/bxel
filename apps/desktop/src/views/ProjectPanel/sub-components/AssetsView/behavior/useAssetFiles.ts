/* @layer renderer-app @kind hook */
import { useEffect, useState } from 'react';
import type { ListedFile } from '../../../../../asset-list/asset-list.type';
import { listProjectFiles } from '../../../../../asset-list/list-project-files';
import { watchRoots } from '../../../../../asset-list/watch-roots';
import { fileKit } from '../../../../../files/file-kit';
import type { OpenProject } from '../../../../../project/project.type';

const useAssetFiles = (project: OpenProject | null): readonly ListedFile[] => {
  const [files, setFiles] = useState<readonly ListedFile[]>([]);
  const [tick, setTick] = useState(0);
  const key = project?.folders.filter((folder) => folder.granted).map((folder) => folder.path).join('|') ?? '';

  useEffect(() => {
    const kit = fileKit();
    return kit && key !== '' ? watchRoots(kit.documents, key.split('|'), () => setTick((value) => value + 1)) : undefined;
  }, [key]);

  useEffect(() => {
    const kit = fileKit();
    if (!kit || !project) {
      setFiles([]);
      return undefined;
    }
    let live = true;
    void listProjectFiles(kit.documents, project).then((found) => live && setFiles(found));
    return () => {
      live = false;
    };
  }, [project, tick]);

  return files;
};

export { useAssetFiles };
