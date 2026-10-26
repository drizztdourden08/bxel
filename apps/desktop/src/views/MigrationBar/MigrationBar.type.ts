/* @layer renderer-app @kind types */
type MigrationLine = { readonly key: string; readonly text: string };

type MigrationView = { readonly notice: string; readonly lines: readonly MigrationLine[] };

export type { MigrationView };
