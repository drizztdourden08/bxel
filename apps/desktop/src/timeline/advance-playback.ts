/* @layer renderer-app @kind logic */
import { currentTarget } from '../editor/current-target';
import { useTimelineStore } from '../stores/useTimelineStore';
import { nextCursor } from './next-cursor';
import { playSequence } from './play-sequence';

const advancePlayback = (): boolean => {
  const target = currentTarget();
  const state = useTimelineStore.getState();
  if (!target) {
    state.pause();
    return false;
  }
  const sequence = playSequence(target.sprite, target.frameId, { pingPong: state.pingPong, tagId: state.tagId });
  const at = sequence[state.cursor] === target.frameId ? state.cursor : Math.max(0, sequence.indexOf(target.frameId));
  const next = nextCursor(sequence.length, at, state.loop);
  const frameId = next === null ? undefined : sequence[next];
  if (next === null || frameId === undefined) {
    state.pause();
    return false;
  }
  useTimelineStore.setState({ frameId, cursor: next });
  return true;
};

export { advancePlayback };
