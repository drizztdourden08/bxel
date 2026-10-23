/* @layer core @kind logic */
import type { ArchiveRead, ListedEntry } from './archive.type';
import { MAX_FILE_BYTES, ZIP_SIGNATURE } from './container.constants';
import { inflateEntries } from './inflate-entries';
import { LOAD_ERROR } from './load-error.constants';
import type { LoadIssue } from './load-report.type';
import { listEntries } from './list-entries';
import { makeIssue } from './make-issue';
import { sizeIssue } from './size-issue';

const rejected = (issue: LoadIssue): ArchiveRead => ({ ok: false, issue });

const hasZipSignature = (bytes: Uint8Array): boolean => ZIP_SIGNATURE.every((byte, index) => bytes[index] === byte);

const tryList = (bytes: Uint8Array): readonly ListedEntry[] | null => {
  try {
    return listEntries(bytes);
  } catch {
    return null;
  }
};

const readEntries = (bytes: Uint8Array): ArchiveRead => {
  if (bytes.length > MAX_FILE_BYTES) {
    return rejected(makeIssue(LOAD_ERROR.FILE_TOO_LARGE, 'The file is larger than the file limit.'));
  }
  if (!hasZipSignature(bytes)) return rejected(makeIssue(LOAD_ERROR.FILE_NOT_BXEL, 'The file is not a zip archive.'));
  const listed = tryList(bytes);
  if (!listed) return rejected(makeIssue(LOAD_ERROR.FILE_TRUNCATED, 'The archive is cut short or its directory is damaged.'));
  const tooLarge = sizeIssue(listed);
  if (tooLarge) return rejected(tooLarge);
  const names = listed.filter((entry) => !entry.name.endsWith('/')).map((entry) => entry.name);
  return { ok: true, archive: inflateEntries(bytes, names) };
};

export { readEntries };
