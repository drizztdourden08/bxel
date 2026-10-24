/* @layer renderer-app @kind types */
import type { PaletteSource } from '../../palette-source/palette-source.type';

interface PaletteFieldsValue {
  source: PaletteSource;
  limit: number;
  transparent: boolean;
}

interface PaletteFieldsProps {
  value: PaletteFieldsValue;
  limitError: string | null;
  paletteError: string | null;
  withSource: boolean;
  onChange: (patch: Partial<PaletteFieldsValue>) => void;
}

interface LimitFieldsProps {
  limit: number;
  error: string | null;
  onChange: (limit: number) => void;
}

interface SourceSelectProps {
  source: PaletteSource;
  error: string | null;
  onChange: (source: PaletteSource) => void;
}

interface PaletteFileState {
  error: string | null;
  choose: (value: string) => void;
  pick: () => void;
}

export type { LimitFieldsProps, PaletteFieldsProps, PaletteFileState, SourceSelectProps };
