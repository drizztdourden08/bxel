/* @layer renderer-app @kind types */
import type { IconName } from '@drizztdourden08/tessera';
import type { ToolId } from '../../tool.type';
import type { OptionChoice, OptionSurface } from '../tool-options.type';

interface SpecInput {
  tool: ToolId;
  name: string;
  label: string;
  description: string;
  priority: number;
  group: string;
  tier?: 1 | 2;
  surface?: OptionSurface;
  command?: string;
  chord?: string;
  appliesWhen?: () => boolean;
}

interface NumberInput extends SpecInput {
  default: number;
  min: number;
  max: number;
  read: () => number;
  write: (value: number) => void;
}

interface ChoiceInput extends SpecInput {
  default: string;
  choices: readonly OptionChoice[] | (() => readonly OptionChoice[]);
  read: () => string;
  write: (value: string) => void;
}

interface ToggleInput extends SpecInput {
  default?: boolean;
  icon?: IconName;
  read: () => boolean;
  write: (on: boolean) => void;
}

export type { ChoiceInput, NumberInput, SpecInput, ToggleInput };
