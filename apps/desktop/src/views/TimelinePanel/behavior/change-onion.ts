/* @layer renderer-app @kind logic */
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { clampOnion } from './clamp-onion';

const changeOnion = (id: string, index: number, current: number): void => {
  const { setOnion } = useTimelineStore.getState();
  if (id === 'before') setOnion({ before: clampOnion(current - index) });
  else if (id === 'after') setOnion({ after: clampOnion(index - current) });
};

export { changeOnion };
