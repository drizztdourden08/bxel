/* @layer renderer-app @kind types */
interface ExportResult {
  width: number;
  height: number;
  rgba: Uint8ClampedArray<ArrayBuffer>;
  pageCount: number;
}

type ExportOutcome = { readonly ok: true; readonly result: ExportResult } | { readonly ok: false; readonly message: string };

export type { ExportOutcome, ExportResult };
