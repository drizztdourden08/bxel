/* @layer renderer-app @kind types */
import type { BundleId } from '@bxel/mcp';
import type { ARGS_KINDS } from './args-schemas.constants';

type CommandEffect = 'show' | 'edit' | 'file' | 'app';

type ArgsKind = keyof typeof ARGS_KINDS;

type ManifestEntry = {
  readonly area: BundleId;
  readonly effect: CommandEffect;
  readonly args: ArgsKind | null;
  readonly dialog: string | null;
  readonly refuse: string | null;
};

type ManifestExtra = Partial<Pick<ManifestEntry, 'args' | 'dialog' | 'refuse'>>;

export type { CommandEffect, ManifestEntry, ManifestExtra };
