/* @layer renderer-app @kind component */
import { ButtonGroup, IconButton, Tooltip } from '@drizztdourden08/tessera';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { moveCursor } from '../../../timeline/move-cursor';
import { PixelIcon } from '../../PixelIcon';
import { TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';

const TransportBar = () => {
  const playing = useTimelineStore((state) => state.playing);
  const loop = useTimelineStore((state) => state.loop);
  const pingPong = useTimelineStore((state) => state.pingPong);
  const togglePlay = useTimelineStore((state) => state.togglePlay);
  const setLoop = useTimelineStore((state) => state.setLoop);
  const setPingPong = useTimelineStore((state) => state.setPingPong);
  const playName = playing ? TIMELINE_PANEL_TEXT.pause : TIMELINE_PANEL_TEXT.play;
  return (
    <ButtonGroup aria-label={TIMELINE_PANEL_TEXT.transport}>
      <Tooltip content={`${TIMELINE_PANEL_TEXT.previous} (,)`} placement="top">
        <IconButton label={TIMELINE_PANEL_TEXT.previous} size="sm" onClick={() => moveCursor({ frames: -1, layers: 0 }, false)}>
          <PixelIcon name="framePrev" />
        </IconButton>
      </Tooltip>
      <Tooltip content={`${playName} (Enter)`} placement="top">
        <IconButton label={playName} size="sm" active={playing} aria-pressed={playing} onClick={togglePlay}>
          <PixelIcon name={playing ? 'pause' : 'play'} />
        </IconButton>
      </Tooltip>
      <Tooltip content={`${TIMELINE_PANEL_TEXT.next} (.)`} placement="top">
        <IconButton label={TIMELINE_PANEL_TEXT.next} size="sm" onClick={() => moveCursor({ frames: 1, layers: 0 }, false)}>
          <PixelIcon name="frameNext" />
        </IconButton>
      </Tooltip>
      <Tooltip content={TIMELINE_PANEL_TEXT.loop} placement="top">
        <IconButton label={TIMELINE_PANEL_TEXT.loop} size="sm" active={loop} aria-pressed={loop} onClick={() => setLoop(!loop)}>
          <PixelIcon name="loop" />
        </IconButton>
      </Tooltip>
      <Tooltip content={TIMELINE_PANEL_TEXT.pingPong} placement="top">
        <IconButton label={TIMELINE_PANEL_TEXT.pingPong} size="sm" active={pingPong} aria-pressed={pingPong} onClick={() => setPingPong(!pingPong)}>
          <PixelIcon name="pingPong" />
        </IconButton>
      </Tooltip>
    </ButtonGroup>
  );
};

export { TransportBar };
