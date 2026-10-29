/* @layer renderer-app @kind types */
import type { TerrainSet, TerrainVariant } from '@bxel/document';
import type { GridView, TileCell, TilesetModel } from '../TilesetPanel.type';

interface TerrainContext {
  set: TerrainSet;
  sets: readonly TerrainSet[];
}

interface TerrainSlotProps {
  index: number;
  set: TerrainSet;
  cell: TileCell | undefined;
  view: GridView;
  selected: boolean;
  onPick: (index: number) => void;
}

interface TerrainBarProps {
  sets: readonly TerrainSet[];
  set: TerrainSet;
}

interface TerrainBoardProps {
  model: TilesetModel;
  set: TerrainSet;
}

interface PackingPickerProps {
  model: TilesetModel;
  sets: readonly TerrainSet[];
  set: TerrainSet;
}

type SlotDetailProps = PackingPickerProps;

interface TileMarksProps {
  view: GridView;
  cell: TileCell;
}

type SlotChange = (variants: readonly TerrainVariant[]) => readonly TerrainVariant[];

interface VariantRowProps {
  model: TilesetModel;
  variant: TerrainVariant;
  onChange: (weight: number) => void;
  onRemove: () => void;
}

interface SlotButtonsProps {
  variants: readonly TerrainVariant[];
  picked: number | null;
  onSave: (change: SlotChange) => void;
}

export type { PackingPickerProps, SlotButtonsProps, SlotChange, VariantRowProps, SlotDetailProps, TerrainBarProps, TerrainBoardProps, TerrainContext, TerrainSlotProps, TileMarksProps };
