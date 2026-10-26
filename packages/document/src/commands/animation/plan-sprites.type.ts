/* @layer core @kind types */
type SpriteListing = {
  readonly owner: string;
  readonly mode: 'reference' | 'copy';
  readonly durationMs: number | undefined;
};

export type { SpriteListing };
