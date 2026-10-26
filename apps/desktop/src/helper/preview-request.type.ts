/* @layer helper @kind types */
type PreviewRequest = {
  readonly documentId: string | undefined;
  readonly target: Readonly<Record<string, string | undefined>>;
  readonly scale: number;
};

export type { PreviewRequest };
