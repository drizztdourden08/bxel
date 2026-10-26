/* @layer renderer-app @kind hook */
import { useEffect, useMemo, useState } from 'react';
import type { FileFacts, FileFound } from '../../../asset-overview/asset-overview.type';
import { statFile } from '../../../asset-overview/stat-file';
import { fileKit } from '../../../files/file-kit';

const useFileFacts = (path: string | undefined, dirty: boolean): FileFacts => {
  const [found, setFound] = useState<FileFound | null>(null);

  useEffect(() => {
    const kit = fileKit();
    if (path === undefined || !kit || dirty) return undefined;
    let live = true;
    void statFile(kit.documents, path).then((stat) => live && setFound({ path, stat }));
    return () => {
      live = false;
    };
  }, [path, dirty]);

  const stat = found !== null && found.path === path ? found.stat : null;
  return useMemo(() => ({ path: path ?? null, size: stat?.size ?? null, modified: stat?.modified ?? null }), [path, stat]);
};

export { useFileFacts };
