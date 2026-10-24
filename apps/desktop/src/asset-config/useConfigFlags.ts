/* @layer renderer-app @kind hook */
import { useShowFlags } from '@drizztdourden08/brock-react';
import { useActiveAsset } from '../hooks/useActiveAsset';
import { useProjectStore } from '../stores/useProjectStore';
import { KIND_FLAG, PROJECT_FLAG } from './config-flags.constants';

const useConfigFlags = (): void => {
  const kind = useActiveAsset()?.tab?.key.kind ?? '';
  const projectOpen = useProjectStore((state) => state.project !== null);
  useShowFlags({ [KIND_FLAG]: kind, [PROJECT_FLAG]: projectOpen });
};

export { useConfigFlags };
