/* @layer renderer-app @kind logic */
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import { GHOST_CLASS } from './drag-ghost.constants';

const dragGhost = (transfer: DataTransfer, count: number): void => {
  const ghost = document.createElement('div');
  ghost.className = GHOST_CLASS;
  ghost.textContent = MANAGER_TEXT.dragCount(count);
  document.body.appendChild(ghost);
  transfer.setDragImage(ghost, 0, 0);
  window.setTimeout(() => ghost.remove(), 0);
};

export { dragGhost };
