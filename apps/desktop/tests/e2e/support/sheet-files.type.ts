/* @layer renderer-app @kind types */
type SheetFiles = {
  readonly image: { readonly width: number; readonly height: number; readonly data: Uint8ClampedArray };
  readonly json: Record<string, unknown>;
};

export type { SheetFiles };
