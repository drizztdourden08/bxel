/* @layer renderer-app @kind component */
import { ButtonGroup, Icon, IconButton, Tooltip } from '@drizztdourden08/tessera';
import { jumpFrame } from '../../../timeline/jump-frame';
import { stepFrame } from '../../../timeline/step-frame';
import { TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import { PlayControl } from './PlayControl';

const TransportButtons = () => (
  <ButtonGroup aria-label={TIMELINE_PANEL_TEXT.transport}>
    <Tooltip content={TIMELINE_PANEL_TEXT.first} placement="top">
      <IconButton label="First frame" size="sm" onClick={() => jumpFrame('first')}>
        <Icon name="arrow-left-to-line" />
      </IconButton>
    </Tooltip>
    <Tooltip content={`${TIMELINE_PANEL_TEXT.previous} (,)`} placement="top">
      <IconButton label={TIMELINE_PANEL_TEXT.previous} size="sm" onClick={() => stepFrame(-1)}>
        <Icon name="pixel-frame-prev" />
      </IconButton>
    </Tooltip>
    <PlayControl />
    <Tooltip content={`${TIMELINE_PANEL_TEXT.next} (.)`} placement="top">
      <IconButton label={TIMELINE_PANEL_TEXT.next} size="sm" onClick={() => stepFrame(1)}>
        <Icon name="pixel-frame-next" />
      </IconButton>
    </Tooltip>
    <Tooltip content={TIMELINE_PANEL_TEXT.last} placement="top">
      <IconButton label="Last frame" size="sm" onClick={() => jumpFrame('last')}>
        <Icon name="arrow-right-to-line" />
      </IconButton>
    </Tooltip>
  </ButtonGroup>
);

export { TransportButtons };
