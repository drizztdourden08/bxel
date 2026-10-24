/* @layer renderer-app @kind component */
import { ProgressBar } from '@drizztdourden08/tessera';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import { WORKSPACE_TEXT } from '../../workspace/workspace.constants';

const WorkspaceProgress = () => {
  const loading = useWorkspaceStore((state) => state.loading);
  if (loading === null) return null;
  return (
    <ProgressBar
      value={loading.done}
      max={Math.max(loading.total, 1)}
      label={WORKSPACE_TEXT.loadingLabel}
      live
      showValue
      formatValue={(done, total) => WORKSPACE_TEXT.loading(done, total)}
    />
  );
};

export { WorkspaceProgress };
