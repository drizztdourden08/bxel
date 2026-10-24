/* @layer renderer-app @kind component */
import { Flex, SegmentedControl, Slider } from '@drizztdourden08/tessera';
import { ZOOM } from '../../../sheet-manager/manager.constants';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import type { ManagerView } from '../../../sheet-manager/manager.type';
import { useManagerStore } from '../../../stores/useManagerStore';
import { viewOptions } from '../behavior/view-options';

const ViewControls = () => {
  const view = useManagerStore((state) => state.view);
  const zoom = useManagerStore((state) => state.zoom);
  const patch = useManagerStore((state) => state.patch);
  return (
    <Flex gap="xs" align="center">
      <SegmentedControl<ManagerView>
        size="sm"
        aria-label={MANAGER_TEXT.views}
        value={view}
        options={viewOptions()}
        onChange={(next) => patch({ view: next })}
      />
      {view === 'grid' && (
        <Slider
          size="sm"
          aria-label={MANAGER_TEXT.zoom}
          min={ZOOM.min}
          max={ZOOM.max}
          step={ZOOM.step}
          value={zoom}
          onChange={(value) => patch({ zoom: value })}
        />
      )}
    </Flex>
  );
};

export { ViewControls };
