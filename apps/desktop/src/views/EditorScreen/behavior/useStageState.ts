/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { useActiveAsset } from '../../../hooks/useActiveAsset';
import { brokenLinksOf } from '../../../stage-state/broken-links-of';
import type { StageState } from '../../../stage-state/stage-state.type';
import { stageStateOf } from '../../../stage-state/stage-state-of';
import { useFaultStore } from '../../../stores/useFaultStore';
import { useFileStore } from '../../../stores/useFileStore';
import { useHealthStore } from '../../../stores/useHealthStore';
import { useWorkspaceStore } from '../../../stores/useWorkspaceStore';
import { useBxelContext } from '../../../ui-context/useBxelContext';

const useStageState = (): StageState => {
  const surface = useBxelContext((context) => context.surface);
  const loading = useWorkspaceStore((state) => state.loading);
  const opening = useFileStore((state) => state.busy === 'opening');
  const fault = useFaultStore((state) => state.fault);
  const health = useHealthStore((state) => state.state);
  const asset = useActiveAsset();
  const broken = useMemo(() => brokenLinksOf(health, asset?.tab?.key.kind ?? null, asset?.path), [health, asset?.tab?.key.kind, asset?.path]);
  return useMemo(() => stageStateOf({ surface, loading, opening, fault, broken }), [surface, loading, opening, fault, broken]);
};

export { useStageState };
