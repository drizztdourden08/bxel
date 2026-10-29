/* @layer renderer-app @kind types */
import type { BrushAngle, BrushShape } from '@bxel/raster';
import type { OptionSpec, OptionValue } from '../../editor/tool-options/tool-options.type';

interface OptionFieldProps {
  spec: OptionSpec;
  value: OptionValue;
  disabledReason?: string;
  onChange: (value: OptionValue) => void;
}

interface OptionRowProps {
  spec: OptionSpec;
  compact?: boolean;
}

interface BrushPreviewProps {
  size: number;
  shape: BrushShape;
  angle?: BrushAngle;
  small?: boolean;
}

interface ChoiceFieldProps {
  spec: OptionSpec;
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}

export type { BrushPreviewProps, ChoiceFieldProps, OptionFieldProps, OptionRowProps };
