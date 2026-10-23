/* @layer core @kind types */
type MigrationInput = {
  readonly document: unknown;
  readonly blobs: ReadonlyMap<string, Uint8Array>;
};

type Migration = {
  readonly from: number;
  readonly to: number;
  readonly up: (input: MigrationInput) => MigrationInput;
};

export type { Migration, MigrationInput };
