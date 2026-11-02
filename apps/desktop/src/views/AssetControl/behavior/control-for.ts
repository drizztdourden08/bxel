/* @layer renderer-app @kind logic */
import type { ComponentType } from 'react';
import { BankControl } from '../sub-components/BankControl';
import { LimitControl } from '../sub-components/LimitControl';
import { PlatformControl } from '../sub-components/PlatformControl';
import { ReportControl } from '../sub-components/ReportControl';
import { SheetPresets } from '../sub-components/SheetPresets';
import { SpritePresets } from '../sub-components/SpritePresets';
import { TagsControl } from '../sub-components/TagsControl';
import { TileSizeControl } from '../sub-components/TileSizeControl';
import { TilesetLinkControl } from '../sub-components/TilesetLinkControl';

const CONTROLS: Readonly<Record<string, ComponentType>> = {
  'sprite.bank': BankControl,
  'palette.cap': LimitControl,
  'sprite.platform': PlatformControl,
  'sprite.platformReport': ReportControl,
  'sprite.exportPresets': SpritePresets,
  'sheet.exportPresets': SheetPresets,
  'animation.tags': TagsControl,
  'tilemap.tileset': TilesetLinkControl,
  'tileset.tileSize': TileSizeControl,
};

const controlFor = (field: string): ComponentType | undefined => (Object.hasOwn(CONTROLS, field) ? CONTROLS[field] : undefined);

export { controlFor };
