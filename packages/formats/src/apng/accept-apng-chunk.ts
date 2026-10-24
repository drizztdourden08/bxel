/* @layer core @kind logic */
import type { FormatFailure } from '../failure/format.type';
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import { PNG_CHUNK } from '../png-chunk.constants';
import type { RawChunk } from '../png-decode.type';
import { readU32 } from '../read-u32';
import { APNG_CHUNK } from './apng-chunk.constants';
import { APNG_LIMITS } from './apng-limits.constants';
import type { ApngDraft } from './apng.type';
import { readApngControl } from './read-apng-control';

const invalid = (message: string): FormatFailure =>
  formatFail(FORMAT_ERROR_CODE.APNG_INVALID_DATA, message);

const takeSequence = (draft: ApngDraft, sequence: number): FormatFailure | undefined => {
  if (sequence !== draft.nextSequence) {
    return formatFail(FORMAT_ERROR_CODE.APNG_SEQUENCE, `Expected sequence ${draft.nextSequence}, found ${sequence}`);
  }
  draft.nextSequence += 1;
  return undefined;
};

const acceptFctl = (draft: ApngDraft, data: Uint8Array): FormatFailure | undefined => {
  if (data.length !== APNG_LIMITS.FCTL_LENGTH) return invalid('fcTL has the wrong length');
  const control = readApngControl(data);
  const failure = takeSequence(draft, control.sequence);
  if (failure) return failure;
  const frame = { control, data: [] };
  draft.frames.push(frame);
  if (!draft.sawIdat) draft.owner = frame;
  return undefined;
};

const acceptFdat = (draft: ApngDraft, data: Uint8Array): FormatFailure | undefined => {
  const frame = draft.frames.at(-1);
  if (!frame || data.length < APNG_LIMITS.SEQUENCE_LENGTH) return invalid('fdAT has no frame to fill');
  const failure = takeSequence(draft, readU32(data, 0));
  if (failure) return failure;
  frame.data.push(data.subarray(APNG_LIMITS.SEQUENCE_LENGTH));
  return undefined;
};

const acceptActl = (draft: ApngDraft, data: Uint8Array): FormatFailure | undefined => {
  if (data.length !== APNG_LIMITS.ACTL_LENGTH) return invalid('acTL has the wrong length');
  draft.declared = readU32(data, 0);
  draft.plays = readU32(data, 4);
  return undefined;
};

const acceptApngChunk = (draft: ApngDraft, chunk: RawChunk): FormatFailure | undefined => {
  switch (chunk.type) {
    case PNG_CHUNK.IHDR:
      draft.ihdr = chunk.data;
      return undefined;
    case PNG_CHUNK.PLTE:
      draft.plte = chunk.data;
      return undefined;
    case PNG_CHUNK.TRNS:
      draft.trns = chunk.data;
      return undefined;
    case PNG_CHUNK.IDAT:
      draft.sawIdat = true;
      draft.owner?.data.push(chunk.data);
      return undefined;
    case APNG_CHUNK.ACTL:
      return acceptActl(draft, chunk.data);
    case APNG_CHUNK.FCTL:
      return acceptFctl(draft, chunk.data);
    case APNG_CHUNK.FDAT:
      return acceptFdat(draft, chunk.data);
    default:
      return undefined;
  }
};

export { acceptApngChunk };
