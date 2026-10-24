/* @layer renderer-app @kind types */
import type { TilemapForm, TilesetForm } from '../../tilemap/tilemap-form.type';

interface FormModel<T> {
  form: T;
  update: (patch: Partial<T>) => void;
  failure: string | null;
  create: () => void;
}

type TilesetModel = FormModel<TilesetForm>;

type MapModel = FormModel<TilemapForm>;

interface TilesetFieldsProps {
  model: TilesetModel;
}

interface MapFieldsProps {
  model: MapModel;
}

interface SizeFieldSpec {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

interface SizeFieldProps {
  range: { readonly min: number; readonly max: number };
  field: SizeFieldSpec;
}

interface SizePairProps {
  range: { readonly min: number; readonly max: number };
  first: SizeFieldSpec;
  second: SizeFieldSpec;
}

interface DialogActionsProps {
  valid: boolean;
  onCreate: () => void;
}

export type { DialogActionsProps, FormModel, MapFieldsProps, MapModel, SizeFieldProps, SizePairProps, TilesetFieldsProps, TilesetModel };
