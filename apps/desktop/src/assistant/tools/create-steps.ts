/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { Artwork, CommandStep } from '@bxel/document';
import { spritesTarget } from '../../sheet/sprites-target';
import { ANIMATION_SIZE_DEFAULT, TILE_SIZE_DEFAULT } from './create-steps.constants';
import type { CreateInput } from './tool-input.type';

const sheetSteps = (request: CreateInput, artwork: Artwork): readonly CommandStep[] => {
  const sprite = artwork.sprites.find((each) => each.role === 'sprite');
  const create: CommandStep = { name: COMMAND_NAME.sheetCreate, targets: null, options: { name: request.name }, ref: 'sheet' };
  if (!sprite) return [create];
  return [create, { name: COMMAND_NAME.sheetAdd, targets: spritesTarget([sprite.id]), options: { sheet: { ref: 'sheet' } } }];
};

const tilesetStep = (request: CreateInput, artwork: Artwork): CommandStep => {
  const { width, height } = request.tileSize ?? TILE_SIZE_DEFAULT;
  const bankId = artwork.banks[0]?.id;
  return {
    name: COMMAND_NAME.tilesetCreate,
    targets: null,
    options: { name: request.name, tileWidth: width, tileHeight: height, ...(bankId === undefined ? {} : { bankId }) },
    ref: 'tileset',
  };
};

const animationStep = (request: CreateInput): CommandStep => {
  const { width, height, frames } = request.animation ?? ANIMATION_SIZE_DEFAULT;
  return {
    name: COMMAND_NAME.animationCreate,
    targets: null,
    options: { name: request.name, source: { kind: 'blank', width, height, frames } },
  };
};

const mapStep = (request: CreateInput): CommandStep => {
  const { columns, rows } = request.mapSize ?? TILE_SIZE_DEFAULT.map;
  return { name: COMMAND_NAME.tilemapCreate, targets: null, options: { name: request.name, tileset: { ref: 'tileset' }, columns, rows } };
};

const createSteps = (request: CreateInput, artwork: Artwork): readonly CommandStep[] => {
  if (request.kind === 'sheet') return sheetSteps(request, artwork);
  if (request.kind === 'animation') return [animationStep(request)];
  if (request.kind === 'tileset') return [tilesetStep(request, artwork)];
  return request.kind === 'tilemap' ? [tilesetStep(request, artwork), mapStep(request)] : [];
};

export { createSteps };
