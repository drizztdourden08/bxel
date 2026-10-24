/* @layer renderer-app @kind logic */
import type { TargetScope } from '@bxel/document';
import type { EditorTarget } from './editor.type';

const spriteScope = (target: EditorTarget): TargetScope => ({
  sprites: [target.sprite.id],
  layers: { by: 'all' },
  frames: { by: 'all' },
});

export { spriteScope };
