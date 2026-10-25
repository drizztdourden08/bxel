/* @layer renderer-app @kind logic */
import type { FormatBytesResult, PngEncodeResult } from '@bxel/formats';

const bytesOf = (result: FormatBytesResult | PngEncodeResult): Uint8Array => {
  if (!result.ok) throw new Error(result.message);
  return result.bytes;
};

export { bytesOf };
