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

export type { DefaultsEditorProps, NumberFieldProps, SizeValue };
