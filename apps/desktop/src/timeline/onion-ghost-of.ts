/* @layer renderer-app @kind logic */
import type { OnionSettings } from '../stores/timeline-store.type';
import type { OnionGhost, OnionLayer } from './onion.type';

const onionGhostOf = (layer: OnionLayer, onion: OnionSettings): OnionGhost => ({
  frameId: layer.frameId,
  flip: layer.flip,
  side: layer.side,
  tint: onion.tint,
  colour: layer.side === 'before' ? onion.beforeColour : onion.afterColour,
  style: onion.style,
  behind: onion.position === 'behind',
});

export { onionGhostOf };
