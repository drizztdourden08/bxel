/* @layer renderer-app @kind test */
import { encodePngRgba } from '@bxel/formats';
import type { TiledFiles } from '../../src/tiled-import/tiled-import.type';

const COLOURS: readonly (readonly [number, number, number])[] = [
  [200, 40, 40],
  [40, 200, 40],
  [40, 40, 200],
  [200, 200, 40],
];

const pngOf = (columns: number, rows: number, size: number, tiles: readonly number[] = [0, 1, 2, 3]): Uint8Array => {
  const width = columns * size;
  const data = new Uint8ClampedArray(width * rows * size * 4);
  tiles.slice(0, columns * rows).forEach((tile, at) => {
    const [red, green, blue] = COLOURS[tile % COLOURS.length] ?? [0, 0, 0];
    const left = (at % columns) * size;
    const top = Math.floor(at / columns) * size;
    for (let row = 0; row < size; row += 1) {
      for (let column = 0; column < size; column += 1) data.set([red, green, blue, 255], ((top + row) * width + left + column) * 4);
    }
  });
  const encoded = encodePngRgba({ data, width, height: rows * size });
  if (!encoded.ok) throw new Error(encoded.message);
  return encoded.bytes;
};

const TMX = `<?xml version="1.0"?>
<map version="1.10" orientation="orthogonal" width="3" height="2" tilewidth="4" tileheight="4" infinite="0">
 <tileset firstgid="1" source="tiles/ground.tsx"/>
 <layer id="1" name="Ground" width="3" height="2"><data encoding="csv">1,2,3,
4,1,2</data></layer>
 <layer id="2" name="Top" width="3" height="2" visible="0"><data encoding="csv">0,0,0,
0,2147483652,0</data></layer>
 <objectgroup id="3" name="Spawns"/>
</map>`;

const TSX = `<?xml version="1.0"?>
<tileset name="ground" tilewidth="4" tileheight="4" tilecount="4" columns="2">
 <image source="img/ground.png" width="8" height="8"/>
 <tile id="0"><objectgroup><object id="1" x="0" y="0" width="4" height="4"/></objectgroup></tile>
</tileset>`;

const files = (map = TMX): Map<string, string | Uint8Array> =>
  new Map<string, string | Uint8Array>([
    ['C:/maps/level.tmx', map],
    ['C:/maps/tiles/ground.tsx', TSX],
    ['C:/maps/tiles/img/ground.png', pngOf(2, 2, 4)],
  ]);

const stubFiles = (store: Map<string, string | Uint8Array>): TiledFiles => ({
  readText: (path) => {
    const found = store.get(path);
    return typeof found === 'string' ? Promise.resolve(found) : Promise.reject(new Error(`missing ${path}`));
  },
  read: (path) => {
    const found = store.get(path);
    return found instanceof Uint8Array ? Promise.resolve(found) : Promise.reject(new Error(`missing ${path}`));
  },
});

export { COLOURS, TMX, TSX, files, pngOf, stubFiles };
