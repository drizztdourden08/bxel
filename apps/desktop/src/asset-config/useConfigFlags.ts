/* @layer renderer-app @kind hook */
import { useShowFlags } from '@drizztdourden08/brock-react';
import { useSubject } from '../properties-subject/useSubject';
import { useProjectStore } from '../stores/useProjectStore';
import { KIND_FLAG, PROJECT_FLAG } from './config-flags.constants';

const useConfigFlags = (): void => {
  const subject = useSubject();
  const kind = subject.status === 'ready' ? subject.subject.kind : '';
  const projectOpen = useProjectStore((state) => state.project !== null);
  useShowFlags({ [KIND_FLAG]: kind, [PROJECT_FLAG]: projectOpen });
};

export { useConfigFlags };
