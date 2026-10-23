/* @layer renderer-app @kind logic */
import type { TargetScope } from '@bxel/document';
import type { EditorTarget } from './editor.type';

const cellScope = (target: EditorTarget): TargetScope => ({
  sprites: [target.sprite.id],
  layers: { by: 'ids', ids: [target.layerId] },
  frames: { by: 'ids', ids: [target.frameId] },
});

export { cellScope };
