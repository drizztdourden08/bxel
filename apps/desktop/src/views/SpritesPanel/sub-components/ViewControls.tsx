/* @layer renderer-app @kind component */
import { SegmentedControl } from '@drizztdourden08/tessera';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import type { ManagerView } from '../../../sheet-manager/manager.type';
import { useManagerStore } from '../../../stores/useManagerStore';
import { viewOptions } from '../behavior/view-options';

const ViewControls = () => {
  const view = useManagerStore((state) => state.view);
  const patch = useManagerStore((state) => state.patch);
  return <SegmentedControl<ManagerView> size="sm" aria-label={MANAGER_TEXT.views} value={view} options={viewOptions()} onChange={(next) => patch({ view: next })} />;
};

export { ViewControls };
