/* @layer renderer-app @kind types */
import type { SettingsValueSource } from '@drizztdourden08/brock-react';

type FieldResult = string | null | Promise<string | null>;

type SourceField<C> = {
  readonly read: (context: C) => unknown;
  readonly write?: (context: C, value: unknown) => FieldResult;
  readonly buffered?: boolean;
};

type SourceDriver<C> = {
  readonly fields: Readonly<Record<string, SourceField<C>>>;
  readonly context: () => C | null;
  readonly locked: (context: C) => boolean;
  readonly watch: (listener: () => void) => () => void;
  readonly delayMs: number;
  readonly report: (message: string) => void;
};

type ConfigSource = SettingsValueSource & { readonly flush: () => Promise<void> };

type PendingEdit<C> = {
  readonly context: C;
  readonly value: unknown;
  readonly timer: ReturnType<typeof setTimeout>;
};

export type { ConfigSource, FieldResult, PendingEdit, SourceDriver, SourceField };
