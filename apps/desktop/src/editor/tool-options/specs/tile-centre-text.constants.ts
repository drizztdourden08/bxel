/* @layer renderer-app @kind constants */
const TILE_CENTRE_TEXT = {
  stopAtTiles: 'Stop at tile grid',
  stopAtTilesDescription: 'A contiguous fill stays inside the tile cell under the click when the sprite has a tile size.',
  fromCentre: 'From centre',
  fromCentreDescription: 'Draw the shape outward from the point you press. Alt while dragging turns it off.',
} as const;

export { TILE_CENTRE_TEXT };
