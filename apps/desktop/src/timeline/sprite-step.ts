/* @layer renderer-app @kind logic */
import type { CommandStep } from '@bxel/document';
import type { EditorTarget } from '../editor/editor.type';
import { spriteScope } from '../editor/sprite-scope';

const spriteStep = (target: EditorTarget, name: string, options: unknown, ref?: string): CommandStep => ({
  name,
  targets: spriteScope(target),
  options,
  ...(ref === undefined ? {} : { ref }),
});

export { spriteStep };
