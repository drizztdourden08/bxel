/* @layer renderer-app @kind logic */
import { announce } from '@drizztdourden08/brock-react';
import { useTimelineStore } from '../stores/useTimelineStore';
import { stopPlayback } from './stop-playback';
import { TIMELINE_SAY } from './timeline-say.constants';

const togglePlayback = (): void => {
  const state = useTimelineStore.getState();
  if (state.playing) stopPlayback();
  else {
    state.play();
    announce(TIMELINE_SAY.playing);
  }
};

export { togglePlayback };
