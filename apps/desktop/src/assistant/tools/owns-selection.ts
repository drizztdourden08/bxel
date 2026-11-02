/* @layer renderer-app @kind logic */
import { currentTarget } from '../../editor/current-target';
import type { RenderInput } from './tool-input.type';

const ownsSelection = (request: RenderInput): boolean => {
  const open = currentTarget();
  return open !== null && open.documentId === request.documentId && 'spriteId' in request.target && open.sprite.id === request.target.spriteId;
};

export { ownsSelection };
