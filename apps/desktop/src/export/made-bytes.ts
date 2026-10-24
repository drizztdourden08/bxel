/* @layer renderer-app @kind logic */
import type { EncodedBytes, MadeFile } from './export.type';

const madeBytes = (encoded: EncodedBytes): MadeFile =>
  encoded.ok ? { ok: true, data: { kind: 'bytes', bytes: encoded.bytes } } : { ok: false, message: encoded.message };

export { madeBytes };
