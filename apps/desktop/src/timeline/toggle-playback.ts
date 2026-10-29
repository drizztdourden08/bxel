/* @layer renderer-app @kind logic */
import { useTimelineStore } from '../stores/useTimelineStore';
import { stopPlayback } from './stop-playback';

const togglePlayback = (): void => {
  const state = useTimelineStore.getState();
  if (state.playing) stopPlayback();
  else state.play();
};

export { togglePlayback };
