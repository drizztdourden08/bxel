/* @layer core @kind types */
type BufferView = { readonly pixels: Uint8Array; readonly width: number; readonly height: number };
type MaskView = { readonly bits: Uint8Array; readonly width: number; readonly height: number };

export type { BufferView, MaskView };
