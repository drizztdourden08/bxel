/* @layer renderer-app @kind logic */
import type { CreationForm, SpriteSize } from './new-sprite.type';

const spriteSize = (form: CreationForm): SpriteSize =>
  form.kind === 'sheet' ? { width: form.cellWidth, height: form.cellHeight } : { width: form.width, height: form.height };

export { spriteSize };
