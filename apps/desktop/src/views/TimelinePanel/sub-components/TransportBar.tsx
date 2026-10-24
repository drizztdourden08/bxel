/* @layer renderer-app @kind component */
import { ButtonGroup, Icon, IconButton, Tooltip } from '@drizztdourden08/tessera';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { moveCursor } from '../../../timeline/move-cursor';
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
          <Icon name="pixel-frame-prev" />
        </IconButton>
      </Tooltip>
      <Tooltip content={`${playName} (Enter)`} placement="top">
        <IconButton label={playName} size="sm" active={playing} aria-pressed={playing} onClick={togglePlay}>
          <Icon name={playing ? 'pixel-pause' : 'pixel-play'} />
        </IconButton>
      </Tooltip>
      <Tooltip content={`${TIMELINE_PANEL_TEXT.next} (.)`} placement="top">
        <IconButton label={TIMELINE_PANEL_TEXT.next} size="sm" onClick={() => moveCursor({ frames: 1, layers: 0 }, false)}>
          <Icon name="pixel-frame-next" />
        </IconButton>
      </Tooltip>
      <Tooltip content={TIMELINE_PANEL_TEXT.loop} placement="top">
        <IconButton label={TIMELINE_PANEL_TEXT.loop} size="sm" active={loop} aria-pressed={loop} onClick={() => setLoop(!loop)}>
          <Icon name="pixel-loop" />
        </IconButton>
      </Tooltip>
      <Tooltip content={TIMELINE_PANEL_TEXT.pingPong} placement="top">
        <IconButton label={TIMELINE_PANEL_TEXT.pingPong} size="sm" active={pingPong} aria-pressed={pingPong} onClick={() => setPingPong(!pingPong)}>
          <Icon name="pixel-ping-pong" />
        </IconButton>
      </Tooltip>
    </ButtonGroup>
  );
};

export { TransportBar };
