/* @layer renderer-app @kind logic */
import { overlayFit } from './overlay-fit';
import type { RenderInput } from './tool-input.type';

const overlayRequest = (request: RenderInput): RenderInput => {
  const { applied } = overlayFit(request);
  const { target } = request;
  const onion = request.onion === true || applied.includes('onion');
  if (applied.includes('collision') && 'tilesetId' in target && (target.overlay ?? 'none') === 'none') {
    return { ...request, onion, target: { ...target, overlay: 'collision' } };
  }
  return { ...request, onion };
};

export { overlayRequest };
