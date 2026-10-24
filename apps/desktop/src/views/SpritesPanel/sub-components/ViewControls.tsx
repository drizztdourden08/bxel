/* @layer renderer-app @kind component */
import { ButtonGroup, Flex, IconButton, Slider } from '@drizztdourden08/tessera';
import { ZOOM } from '../../../sheet-manager/manager.constants';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import { useManagerStore } from '../../../stores/useManagerStore';
import { PixelIcon } from '../../PixelIcon';

const ViewControls = () => {
  const view = useManagerStore((state) => state.view);
  const zoom = useManagerStore((state) => state.zoom);
  const patch = useManagerStore((state) => state.patch);
  return (
    <Flex gap="xs" align="center">
      <ButtonGroup aria-label={MANAGER_TEXT.views}>
        <IconButton label={MANAGER_TEXT.grid} size="sm" active={view === 'grid'} onClick={() => patch({ view: 'grid' })}>
          <PixelIcon name="gridView" />
        </IconButton>
        <IconButton label={MANAGER_TEXT.list} size="sm" active={view === 'list'} onClick={() => patch({ view: 'list' })}>
          <PixelIcon name="listView" />
        </IconButton>
      </ButtonGroup>
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
