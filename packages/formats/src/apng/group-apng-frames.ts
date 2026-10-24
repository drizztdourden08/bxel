/* @layer core @kind logic */
import type { FormatFailure } from '../failure/format.type';
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import type { RawChunk } from '../png-decode.type';
import { PNG_LIMITS } from '../png-limits.constants';
import { readU32 } from '../read-u32';
import { acceptApngChunk } from './accept-apng-chunk';
import { APNG_LIMITS } from './apng-limits.constants';
import type { ApngDraft, ApngLayout } from './apng.type';

const checkFrames = (draft: ApngDraft): FormatFailure | undefined => {
  const count = draft.frames.length;
  const empty = draft.frames.some((frame) => frame.data.length === 0);
  if (count < 1 || count !== draft.declared || empty) {
    return formatFail(FORMAT_ERROR_CODE.APNG_INVALID_DATA, 'The frame count does not match the frames present');
  }
  return undefined;
};

const buildLayout = (draft: ApngDraft): ApngLayout | FormatFailure => {
  const { ihdr, plays } = draft;
  if (!ihdr) return formatFail(FORMAT_ERROR_CODE.APNG_INVALID_DATA, 'The file has no IHDR');
  if (plays === undefined) {
    return formatFail(FORMAT_ERROR_CODE.APNG_NOT_ANIMATED, 'The PNG has no acTL chunk');
  }
  const invalid = checkFrames(draft);
  if (invalid) return invalid;
  const width = readU32(ihdr, 0);
  const height = readU32(ihdr, 4);
  const oversized = Math.max(width, height) > PNG_LIMITS.IMPORT_MAX_SIDE;
  const pixels = draft.frames.length * width * height;
  if (oversized || draft.frames.length > APNG_LIMITS.MAX_FRAMES || pixels > APNG_LIMITS.MAX_TOTAL_PIXELS) {
    return formatFail(FORMAT_ERROR_CODE.APNG_TOO_LARGE, 'The animation is too large to import');
  }
  return { ihdr, plte: draft.plte, trns: draft.trns, plays, width, height, frames: draft.frames };
};

const groupApngFrames = (chunks: readonly RawChunk[]): ApngLayout | FormatFailure => {
  const draft: ApngDraft = {
    ihdr: undefined,
    plte: undefined,
    trns: undefined,
    plays: undefined,
    declared: 0,
    frames: [],
    sawIdat: false,
    nextSequence: 0,
    owner: undefined,
  };
  for (const chunk of chunks) {
    const failure = acceptApngChunk(draft, chunk);
    if (failure) return failure;
  }
  return buildLayout(draft);
};

export { groupApngFrames };
