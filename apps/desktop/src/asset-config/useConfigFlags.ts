/* @layer renderer-app @kind hook */
import { useShowFlags } from '@drizztdourden08/brock-react';
import { useSubject } from '../properties-subject/useSubject';
import { useProjectStore } from '../stores/useProjectStore';
import { useBxelContext } from '../ui-context/useBxelContext';
import { CONTEXT_FLAGS } from '../ui-context/context-flags.constants';
import { KIND_FLAG, PROJECT_FLAG } from './config-flags.constants';

const useConfigFlags = (): void => {
  const context = useBxelContext((current) => current);
  const subject = useSubject();
  const subjectKind = subject.status === 'ready' ? subject.subject.kind : '';
  const pinned = subject.status === 'ready' && subject.subject.pinned;
  const kind = context.fileType === 'image' && !pinned ? '' : subjectKind;
  const projectOpen = useProjectStore((state) => state.project !== null);
  useShowFlags({
    [KIND_FLAG]: kind,
    [PROJECT_FLAG]: projectOpen,
    [CONTEXT_FLAGS.fileType]: context.fileType,
    [CONTEXT_FLAGS.surface]: context.surface,
    [CONTEXT_FLAGS.readOnly]: context.readOnly,
  });
};

export { useConfigFlags };
