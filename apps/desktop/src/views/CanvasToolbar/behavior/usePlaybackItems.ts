/* @layer renderer-app @kind hook */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { useActiveDocument } from '../../../hooks/useActiveDocument';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { toggleItem } from '../../../toolbar-items';
import { ONION_HINT, PAUSE_HINT, PLAY_HINT } from '../CanvasToolbar.constants';

const usePlaybackItems = (): ToolbarItem[] => {
  const disabled = useActiveDocument() === null;
  const onion = useTimelineStore((state) => state.onion.on);
  const playing = useTimelineStore((state) => state.playing);
  const setOnion = useTimelineStore((state) => state.setOnion);
  const togglePlay = useTimelineStore((state) => state.togglePlay);
  return [
    toggleItem({ id: 'onion', icon: 'pixel-onion-skin', hint: ONION_HINT, disabled, pressed: onion, onChange: (on) => setOnion({ on }) }),
    toggleItem({
      id: 'play', icon: playing ? 'pixel-pause' : 'pixel-play', hint: playing ? PAUSE_HINT : PLAY_HINT, disabled, pressed: playing, onChange: togglePlay,
    }),
  ];
};

export { usePlaybackItems };
