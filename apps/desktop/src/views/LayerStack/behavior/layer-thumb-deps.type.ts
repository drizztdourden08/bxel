/* @layer renderer-app @kind types */
interface ThumbDeps {
  pixels: Uint8Array | Uint32Array | null | undefined;
  bank: object | null;
  width: number;
  height: number;
}

export type { ThumbDeps };
