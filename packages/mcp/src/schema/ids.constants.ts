/* @layer core @kind constants */
import { z } from 'zod';
import { idSchemaOf } from './id-schema-of';

const DOCUMENT_ID_SCHEMA = idSchemaOf('doc').meta({ id: 'DocumentId' });
const SPRITE_ID_SCHEMA = idSchemaOf('spr').meta({ id: 'SpriteId' });
const LAYER_ID_SCHEMA = idSchemaOf('lay').meta({ id: 'LayerId' });
const FRAME_ID_SCHEMA = idSchemaOf('frm').meta({ id: 'FrameId' });
const BANK_ID_SCHEMA = idSchemaOf('bnk').meta({ id: 'BankId' });
const SHEET_ID_SCHEMA = idSchemaOf('sht').meta({ id: 'SheetId' });
const PROJECT_ID_SCHEMA = idSchemaOf('prj').meta({ id: 'ProjectId' });
const FOLDER_ID_SCHEMA = idSchemaOf('fld').meta({ id: 'FolderId' });
const RECENT_ID_SCHEMA = idSchemaOf('rcf').meta({ id: 'RecentId' });
const ANIMATION_ID_SCHEMA = idSchemaOf('anm').meta({ id: 'AnimationId' });
const ANIM_FRAME_ID_SCHEMA = idSchemaOf('afr').meta({ id: 'AnimFrameId' });
const TAG_ID_SCHEMA = idSchemaOf('tag').meta({ id: 'TagId' });
const TILESET_ID_SCHEMA = idSchemaOf('tls').meta({ id: 'TilesetId' });
const TILEMAP_ID_SCHEMA = idSchemaOf('tlm').meta({ id: 'TilemapId' });
const MAP_LAYER_ID_SCHEMA = idSchemaOf('tml').meta({ id: 'MapLayerId' });
const REVISION_SCHEMA = z.number().int().min(1).meta({ id: 'Revision' });

export {
  ANIM_FRAME_ID_SCHEMA,
  ANIMATION_ID_SCHEMA,
  BANK_ID_SCHEMA,
  DOCUMENT_ID_SCHEMA,
  FOLDER_ID_SCHEMA,
  FRAME_ID_SCHEMA,
  LAYER_ID_SCHEMA,
  MAP_LAYER_ID_SCHEMA,
  PROJECT_ID_SCHEMA,
  RECENT_ID_SCHEMA,
  REVISION_SCHEMA,
  SHEET_ID_SCHEMA,
  SPRITE_ID_SCHEMA,
  TAG_ID_SCHEMA,
  TILEMAP_ID_SCHEMA,
  TILESET_ID_SCHEMA,
};
