/* @layer renderer-app @kind logic */
import { findBank } from '@bxel/document';
import type { LayerId } from '@bxel/document';
import type { DocumentView } from '../documents/document-host.type';
import { activeLayer } from './active-layer';
import type { EditorTarget } from './editor.type';

const activeTarget = (view: DocumentView | null, layerId: LayerId | null = null): EditorTarget | null => {
  if (!view) return null;
  const { documentId, revision, project } = view.state;
  const sprite = project.sprites[0];
  const layer = sprite ? activeLayer(sprite, layerId) : undefined;
  const frame = sprite?.frames[0];
  const bank = sprite ? findBank(project, sprite.bankId) : undefined;
  if (!sprite || !layer || !frame || !bank) return null;
  return { documentId, revision, sprite, bank, layer, layerId: layer.id, frameId: frame.id };
};

export { activeTarget };
