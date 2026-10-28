/* @layer renderer-app @kind logic */
import type { OnionSettings } from '../../../stores/timeline-store.type';
import type { OnionGhost, OnionLayer } from '../../../timeline/onion.type';

const layerGhost = (layer: OnionLayer, onion: OnionSettings): OnionGhost => ({
  frameId: layer.frameId,
  flip: layer.flip,
  side: layer.side,
  tint: onion.tint,
  colour: layer.side === 'before' ? onion.beforeColour : onion.afterColour,
  style: onion.style,
  behind: onion.position === 'behind',
});

export { layerGhost };
