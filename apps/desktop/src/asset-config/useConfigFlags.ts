/* @layer renderer-app @kind hook */
import { useShowFlags } from '@drizztdourden08/brock-react';
import { MANY_KIND } from '../properties-subject/many-subject.constants';
import { useManyStore } from '../properties-subject/useManyStore';
import { useSubject } from '../properties-subject/useSubject';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { useProjectStore } from '../stores/useProjectStore';
import { useBxelContext } from '../ui-context/useBxelContext';
import { CONTEXT_FLAGS } from '../ui-context/context-flags.constants';
import { KIND_FLAG, PROJECT_FLAG } from './config-flags.constants';

const useConfigFlags = (): void => {
  const context = useBxelContext((current) => current);
  const subject = useSubject();
  const subjectKind = subject.status === 'ready' ? subject.subject.kind : '';
  const pinned = subject.status === 'ready' && subject.subject.pinned;
  const activeTab = useWorkspaceStore((state) => state.activeTab);
  const many = useManyStore((state) => state.many !== null && state.many.tabId === activeTab);
  const single = context.fileType === 'image' && !pinned ? '' : subjectKind;
  const kind = many ? MANY_KIND : single;
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
