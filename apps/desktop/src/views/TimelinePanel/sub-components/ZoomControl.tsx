/* @layer renderer-app @kind component */
import { Button, ButtonGroup, DropdownMenu, Icon, IconButton, Tooltip } from '@drizztdourden08/tessera';
import { THUMB_SIZES } from '../../../stores/timeline-store.constants';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { stepZoom } from '../../../timeline/step-zoom';
import { TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';

const ZoomControl = () => {
  const zoom = useTimelineStore((state) => state.zoom);
  const fit = useTimelineStore((state) => state.fit);
  const store = useTimelineStore.getState();
  return (
    <ButtonGroup aria-label={TIMELINE_PANEL_TEXT.zoom}>
      <Tooltip content={`${TIMELINE_PANEL_TEXT.zoomOut} (Ctrl+Minus)`} placement="top">
        <IconButton label={TIMELINE_PANEL_TEXT.zoomOut} size="sm" disabled={zoom <= (THUMB_SIZES[0] ?? 24)} onClick={() => store.setZoom(stepZoom(zoom, -1))}>
          <Icon name="pixel-zoom-out" />
        </IconButton>
      </Tooltip>
      <DropdownMenu
        size="sm"
        variant="secondary"
        label={TIMELINE_PANEL_TEXT.zoom}
        trigger={{ label: fit ? TIMELINE_PANEL_TEXT.fitShort : TIMELINE_PANEL_TEXT.zoomSize(zoom) }}
        groups={[{ id: 'sizes', items: THUMB_SIZES.map((size) => ({ id: `size-${size}`, label: TIMELINE_PANEL_TEXT.zoomSize(size), kind: 'radio' as const, checked: !fit && zoom === size, onSelect: () => store.setZoom(size) })) }]}
      />
      <Tooltip content={`${TIMELINE_PANEL_TEXT.zoomIn} (Ctrl+Plus)`} placement="top">
        <IconButton label={TIMELINE_PANEL_TEXT.zoomIn} size="sm" disabled={zoom >= (THUMB_SIZES.at(-1) ?? 96)} onClick={() => store.setZoom(stepZoom(zoom, 1))}>
          <Icon name="pixel-zoom-in" />
        </IconButton>
      </Tooltip>
      <Tooltip content={TIMELINE_PANEL_TEXT.fit} placement="top">
        <Button size="sm" variant="secondary" aria-pressed={fit} onClick={() => store.setFit(!fit)}>
          {TIMELINE_PANEL_TEXT.fitShort}
        </Button>
      </Tooltip>
    </ButtonGroup>
  );
};

export { ZoomControl };
