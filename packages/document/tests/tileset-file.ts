/* @layer core @kind helper */
import type { Engine } from '@bxel/document';
import { splitIntoAssets } from '@bxel/document';
import { decodeTileset } from '@bxel/document/native';
import type { AssetReport } from '@bxel/document/native';
import { encodeSlice } from './asset-bytes';

const tilesetReport = (engine: Engine): AssetReport => {
  const { files } = splitIntoAssets(engine.state().artwork);
  const file = files.find((each) => each.key.kind === 'tileset');
  const palette = files.find((each) => each.key.kind === 'palette');
  if (!file || !palette) throw new Error('no tileset file');
  return decodeTileset(encodeSlice(file.slice), palette.slice);
};

export { tilesetReport };
