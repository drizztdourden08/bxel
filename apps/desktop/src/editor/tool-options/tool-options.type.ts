/* @layer renderer-app @kind types */
import type { IconName, ShortcutKey } from '@drizztdourden08/tessera';
import type { ToolId } from '../tool.type';

type OptionValue = number | string | boolean;

type OptionKind = 'number' | 'choice' | 'toggle' | 'action';

type OptionTier = 1 | 2;

type OptionSurface = 'paint' | 'map';

type OptionMemory = 'tool' | 'global';

interface OptionChoice {
  value: string;
  label: string;
  description: string;
  icon?: IconName;
  glyph?: string;
  keys?: readonly ShortcutKey[];
}

interface OptionShortcut {
  command: string;
  label?: string;
}

interface OptionSpec {
  id: string;
  name: string;
  tool: ToolId;
  surface: OptionSurface;
  kind: OptionKind;
  label: string;
  description: string;
  tier: OptionTier;
  priority: number;
  group: string;
  memory: OptionMemory;
  default: OptionValue;
  min?: number;
  max?: number;
  step?: number;
  choices?: readonly OptionChoice[];
  icon?: IconName;
  caption?: string;
  command?: string;
  chord?: string;
  shortcuts?: readonly OptionShortcut[];
  flyout?: boolean;
  read: () => OptionValue;
  write: (value: OptionValue) => void;
  disabledReason?: () => string | undefined;
  appliesWhen?: () => boolean;
}

type OptionBase = Pick<OptionSpec, 'tool' | 'surface' | 'memory'>;

type OptionValues = Readonly<Record<string, OptionValue>>;

export type { OptionBase, OptionChoice, OptionSpec, OptionSurface, OptionValue, OptionValues };
