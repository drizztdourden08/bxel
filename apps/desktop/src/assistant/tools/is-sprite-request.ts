/* @layer renderer-app @kind logic */
import type { RenderInput } from './tool-input.type';

const isSpriteRequest = (request: RenderInput): boolean => 'spriteId' in request.target;

export { isSpriteRequest };
