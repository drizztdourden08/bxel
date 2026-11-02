/* @layer renderer-app @kind logic */
import { getPlatform } from '@drizztdourden08/brock-react';
import { LOSPEC_MAX_BYTES, LOSPEC_TEXT, LOSPEC_TYPES, lospecUrl } from './lospec.constants';
import type { LospecResult } from './palette-import.type';
import { readLospec } from './read-lospec';

const fetchLospec = async (slug: string): Promise<LospecResult> => {
  const net = getPlatform().net;
  if (!net) return { ok: false, message: LOSPEC_TEXT.offline };
  try {
    const answer = await net.read(lospecUrl(slug), { maxBytes: LOSPEC_MAX_BYTES, types: [...LOSPEC_TYPES] });
    const source = readLospec(new TextDecoder().decode(answer.bytes));
    return source ? { ok: true, source } : { ok: false, message: LOSPEC_TEXT.unreadable };
  } catch {
    return { ok: false, message: LOSPEC_TEXT.failed(slug) };
  }
};

export { fetchLospec };
