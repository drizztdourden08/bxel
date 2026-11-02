/* @layer renderer-app @kind component */
import type { ReactNode } from 'react';
import { PAIR_FIELDS } from './AssetControl.constants';
import type { AssetControlProps } from './AssetControl.type';
import { BankControl } from './sub-components/BankControl';
import { LimitControl } from './sub-components/LimitControl';
import { PairControl } from './sub-components/PairControl';
import { PlatformControl } from './sub-components/PlatformControl';
import { PresetsControl } from './sub-components/PresetsControl';
import { ReportControl } from './sub-components/ReportControl';
import { TagsControl } from './sub-components/TagsControl';
import { TileSizeControl } from './sub-components/TileSizeControl';
import { TilesetLinkControl } from './sub-components/TilesetLinkControl';

const CONTROLS: Readonly<Record<string, () => ReactNode>> = {
  'sprite.bank': () => <BankControl />,
  'palette.cap': () => <LimitControl />,
  'sprite.platform': () => <PlatformControl />,
  'sprite.platformReport': () => <ReportControl />,
  'sprite.exportPresets': () => <PresetsControl group="sprite" />,
  'sheet.exportPresets': () => <PresetsControl group="sheet" />,
  'animation.tags': () => <TagsControl />,
  'tilemap.tileset': () => <TilesetLinkControl />,
  'tileset.tileSize': () => <TileSizeControl />,
};

const AssetControl = ({ field }: AssetControlProps) => {
  const control = Object.hasOwn(CONTROLS, field) ? CONTROLS[field] : undefined;
  if (control) return control();
  const pair = PAIR_FIELDS[field];
  return pair ? <PairControl spec={pair} /> : null;
};

export { AssetControl };
