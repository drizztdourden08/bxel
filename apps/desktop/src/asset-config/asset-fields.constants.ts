/* @layer renderer-app @kind constants */
import type { AssetFields } from './asset-config.type';
import { TILEMAP_FIELDS, TILESET_FIELDS } from './map-fields.constants';
import { PALETTE_FIELDS } from './palette-fields.constants';
import { SHEET_FIELDS } from './sheet-fields.constants';
import { SPRITE_FIELDS } from './sprite-fields.constants';
import { PLATFORM_FIELDS, VIEW_FIELDS } from './view-fields.constants';

const ASSET_FIELDS: AssetFields = {
  ...SPRITE_FIELDS,
  ...PLATFORM_FIELDS,
  ...VIEW_FIELDS,
  ...SHEET_FIELDS,
  ...PALETTE_FIELDS,
  ...TILESET_FIELDS,
  ...TILEMAP_FIELDS,
};

export { ASSET_FIELDS };
