/* @layer renderer-app @kind logic */
import { pickHow } from '../../../sheet/pick-how';
import type { SpriteEvents, SpriteHandlers } from '../SpritesPanel.type';

const spriteEvents = (handlers: SpriteHandlers): SpriteEvents => ({
  onClick: (event) => handlers.onPick(pickHow(event) ?? 'replace'),
  onDoubleClick: handlers.onRename,
  onContextMenu: () => handlers.onMenu(),
});

export { spriteEvents };
