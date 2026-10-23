/* @layer core @kind types */
type PngHeader = {
  readonly width: number;
  readonly height: number;
  readonly bitDepth: number;
  readonly colorType: number;
  readonly bitsPerPixel: number;
};

type PngChunks = {
  readonly ihdr: Uint8Array;
  readonly plte: Uint8Array | undefined;
  readonly trns: Uint8Array | undefined;
  readonly idat: Uint8Array;
};

type RawChunk = {
  readonly type: string;
  readonly data: Uint8Array;
  readonly next: number;
};

type ChunkState = {
  ihdr: Uint8Array | undefined;
  plte: Uint8Array | undefined;
  trns: Uint8Array | undefined;
  readonly idat: Uint8Array[];
  ended: boolean;
};

type ExpandContext = {
  readonly data: Uint8Array;
  readonly header: PngHeader;
  readonly plte: Uint8Array | undefined;
  readonly trns: Uint8Array | undefined;
};

type PixelWriter = (row: number, x: number, out: Uint8ClampedArray, at: number) => boolean;

export type { ChunkState, ExpandContext, PixelWriter, PngChunks, PngHeader, RawChunk };
