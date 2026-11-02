/* @layer renderer-app @kind logic */
import { isSpriteRequest } from './is-sprite-request';
import type { RenderInput } from './tool-input.type';

const isFrameRequest = (request: RenderInput): boolean =>
  request.animated === undefined && (isSpriteRequest(request) || ('animationId' in request.target && request.target.frameId !== undefined));

export { isFrameRequest };
