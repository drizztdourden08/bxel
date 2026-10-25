/* @layer renderer-app @kind constants */
const TILED_E2E = {
  map: 'level.tmx',
  tileset: 'tiles/ground.tsx',
  image: 'tiles/ground.png',
  side: 4,
  columns: 3,
  rows: 2,
  cells: [1, 2, 3, 4, 1, 2],
  colours: [
    [200, 40, 40],
    [40, 200, 40],
    [40, 40, 200],
    [200, 200, 40],
  ],
  savedMap: 'level.bxmap',
  savedTiles: 'ground.bxtiles',
} as const;

const TILED_MAP = `<?xml version="1.0"?>
<map version="1.10" orientation="orthogonal" width="3" height="2" tilewidth="4" tileheight="4" infinite="0">
 <tileset firstgid="1" source="tiles/ground.tsx"/>
 <layer id="1" name="Ground" width="3" height="2"><data encoding="csv">1,2,3,
4,1,2</data></layer>
</map>
`;

const TILED_TILESET = `<?xml version="1.0"?>
<tileset name="ground" tilewidth="4" tileheight="4" tilecount="4" columns="2">
 <image source="ground.png" width="8" height="8"/>
</tileset>
`;

export { TILED_E2E, TILED_MAP, TILED_TILESET };
