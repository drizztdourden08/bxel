/* @layer renderer-app @kind types */
import type { AssetDefaults } from '@bxel/project';
import type { BankOption } from '../../palette-bank/palette-bank.type';

interface DefaultsEditorProps {
  field: keyof AssetDefaults;
  value: unknown;
  files?: readonly BankOption[];
  onChange: (value: unknown) => void;
}

interface NumberFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit?: string;
  onChange: (value: number) => void;
}

type SizeValue = { readonly width: number; readonly height: number };

interface SizeEditorProps {
  value: unknown;
  fallback?: SizeValue;
  labels?: { readonly width: string; readonly height: string };
  onChange: (value: unknown) => void;
}

export type { DefaultsEditorProps, NumberFieldProps, SizeEditorProps, SizeValue };
