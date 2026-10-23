/* @layer core @kind types */
import type { TargetScope } from '../scope/target-scope.type';
import type { EXPORT_FORMAT } from './export-format.constants';
import type { PresetId, SheetId } from './ids.type';

type ExportFormat = (typeof EXPORT_FORMAT)[keyof typeof EXPORT_FORMAT];

type JsonValue =
  | string
  | number
  | boolean
  | null
  | readonly JsonValue[]
  | { readonly [key: string]: JsonValue };

type ExportPreset = {
  readonly id: PresetId;
  readonly name: string;
  readonly format: ExportFormat;
  readonly scale: number;
  readonly scope: TargetScope;
  readonly sheetId: SheetId | null;
  readonly pathTemplate: string;
  readonly settings: Readonly<Record<string, JsonValue>>;
};

export type { ExportFormat, ExportPreset, JsonValue };
