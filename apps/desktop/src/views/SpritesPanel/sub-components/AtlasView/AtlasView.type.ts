/* @layer renderer-app @kind types */
import type { Artwork, Sheet, SpriteId } from '@bxel/document';
import type { AtlasModel } from '../../../../sheet-manager/manager.type';
import type { ManagerModelProps } from '../../SpritesPanel.type';

interface AtlasDraw {
  artwork: Artwork;
  atlas: AtlasModel;
  scale: number;
  bounds: boolean;
  pivots: boolean;
  selected: ReadonlySet<SpriteId>;
}

interface AtlasCanvasProps extends ManagerModelProps {
  atlas: AtlasModel;
}

interface AtlasControlsProps {
  sheet: Sheet;
}

interface StyleNumberProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onCommit: (value: number) => void;
}

export type { AtlasCanvasProps, AtlasControlsProps, AtlasDraw, StyleNumberProps };
