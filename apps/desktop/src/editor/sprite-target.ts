/* @layer renderer-app @kind logic */
import { findBank } from '@bxel/document';
import type { LayerId, Sprite } from '@bxel/document';
import type { DocumentView } from '../documents/document-host.type';
import { activeLayer } from './active-layer';
import type { EditorTarget } from './editor.type';

const spriteTarget = (view: DocumentView, sprite: Sprite, layerId: LayerId | null): EditorTarget | null => {
  const { documentId, revision, artwork } = view.state;
  const layer = activeLayer(sprite, layerId);
  const frame = sprite.frames[0];
  const bank = findBank(artwork, sprite.bankId);
  if (!layer || !frame || !bank) return null;
  return { documentId, revision, sprite, bank, layer, layerId: layer.id, frameId: frame.id };
};

export { spriteTarget };
