/* @layer renderer-app @kind logic */
import { flattenFrame } from '@bxel/document';
import type { EditorTarget } from '../editor.type';

const allPixels = ({ sprite, frameId }: EditorTarget): Uint8Array =>
  flattenFrame({ ...sprite, layers: sprite.layers.map((layer) => (layer.visible ? layer : { ...layer, visible: true })) }, frameId);

export { allPixels };
