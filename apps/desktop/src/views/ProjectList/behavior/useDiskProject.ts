/* @layer renderer-app @kind hook */
import { useEffect, useState } from 'react';
import { fileKit } from '../../../files/file-kit';
import { inspectProject } from '../../../project-manager/inspect-project';
import type { DiskState, KnownProject } from '../../../project-manager/project-manager.type';
import { useProjectStore } from '../../../stores/useProjectStore';
import { IDLE_DISK } from '../ProjectList.constants';

const useDiskProject = (target: KnownProject | null): DiskState => {
  const [state, setState] = useState<DiskState>(IDLE_DISK);
  const root = target !== null && !target.open ? target.rootRealPath : null;

  useEffect(() => {
    const kit = fileKit();
    if (root === null || !kit) {
      setState(IDLE_DISK);
      return undefined;
    }
    let live = true;
    setState({ status: 'loading' });
    const { project, held } = useProjectStore.getState();
    const inUse = project ? [project, ...held] : [...held];
    void inspectProject(kit.documents, root, inUse).then((outcome) => {
      if (live) setState(outcome.ok ? { status: 'ready', project: outcome.project } : { status: 'failed', message: outcome.message });
    });
    return () => {
      live = false;
    };
  }, [root]);

  return state;
};

export { useDiskProject };
