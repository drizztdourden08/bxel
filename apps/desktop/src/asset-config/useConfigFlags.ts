/* @layer renderer-app @kind hook */
import { useShowFlags } from '@drizztdourden08/brock-react';
import { useActiveAsset } from '../hooks/useActiveAsset';
import { useProjectStore } from '../stores/useProjectStore';
import { useBxelContext } from '../ui-context/useBxelContext';
import { CONTEXT_FLAGS } from '../ui-context/context-flags.constants';
import { KIND_FLAG, PROJECT_FLAG } from './config-flags.constants';

const useConfigFlags = (): void => {
  const context = useBxelContext((current) => current);
  const tabKind = useActiveAsset()?.tab?.key.kind ?? '';
  const kind = context.fileType === 'image' ? '' : tabKind;
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
