/* @layer tests @kind helper */
import { deflateSync } from 'node:zlib';
import type { RgbaImage } from '@bxel/formats';

const gidBytes = (gids: readonly number[]): Uint8Array => {
  const bytes = new Uint8Array(gids.length * 4);
  const view = new DataView(bytes.buffer);
  gids.forEach((gid, at) => view.setUint32(at * 4, gid, true));
  return bytes;
};

const base64Of = (bytes: Uint8Array): string => Buffer.from(bytes).toString('base64');

const zlibLayer = (gids: readonly number[]): string => base64Of(deflateSync(gidBytes(gids)));

const sheetImage = (columns: number, rows: number, size: number): RgbaImage => {
  const width = columns * size;
  const height = rows * size;
  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const id = Math.floor(y / size) * columns + Math.floor(x / size);
      data.set([id * 20, 100, 50, 255], (y * width + x) * 4);
    }
  }
  return { data, width, height };
};

const TMX = `<?xml version="1.0" encoding="UTF-8"?>
<map version="1.10" orientation="orthogonal" renderorder="right-down" width="3" height="2" tilewidth="4" tileheight="4" infinite="0">
 <tileset firstgid="1" source="ground.tsx"/>
 <tileset firstgid="5" name="props" tilewidth="4" tileheight="4" tilecount="2" columns="2">
  <image source="props.png" width="8" height="4"/>
 </tileset>
 <layer id="1" name="Ground" width="3" height="2">
  <data encoding="csv">1,2,3,
4,5,6</data>
 </layer>
 <group name="Over" visible="1">
  <layer id="2" name="Top" width="3" height="2" visible="0">
   <data><tile gid="0"/><tile gid="2147483649"/><tile gid="0"/><tile gid="0"/><tile gid="0"/><tile gid="0"/></data>
  </layer>
 </group>
 <objectgroup id="3" name="Spawns"/>
</map>`;

const TSX = `<?xml version="1.0" encoding="UTF-8"?>
<tileset version="1.10" name="ground" tilewidth="4" tileheight="4" tilecount="4" columns="2" spacing="1" margin="1">
 <image source="ground.png" width="11" height="11" trans="ff00ff"/>
 <tile id="1"><properties><property name="solid" type="bool" value="true"/></properties>
  <objectgroup><object id="1" x="0" y="0" width="4" height="2"/></objectgroup></tile>
</tileset>`;

const tmjText = (data: unknown, extra: Record<string, unknown> = {}): string =>
  JSON.stringify({
    type: 'map',
    orientation: 'orthogonal',
    width: 2,
    height: 2,
    tilewidth: 4,
    tileheight: 4,
    infinite: false,
    tilesets: [{ firstgid: 1, name: 'a', tilewidth: 4, tileheight: 4, tilecount: 4, columns: 2, image: 'a.png', imagewidth: 8, imageheight: 8 }],
    layers: [{ type: 'tilelayer', name: 'L', width: 2, height: 2, visible: true, data, ...extra }],
  });

export { TMX, TSX, base64Of, gidBytes, sheetImage, tmjText, zlibLayer };
