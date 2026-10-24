/* @layer core @kind logic */
import type { ArchiveContents } from './archive.type';
import { crc32 } from './crc32';
import type { EntryCheck } from './entry-check.type';
import { LOAD_ERROR } from './load-error.constants';
import type { LoadIssue } from './load-report.type';
import type { Manifest, ManifestEntry } from './manifest.type';
import { makeIssue } from './make-issue';

const missingIssue = (path: string, archive: ArchiveContents): LoadIssue =>
  archive.unreadable.has(path)
    ? makeIssue(LOAD_ERROR.ENTRY_CHECKSUM, `${path} cannot be inflated.`, path)
    : makeIssue(LOAD_ERROR.ENTRY_MISSING, `${path} is listed but missing.`, path);

const verify = (entry: ManifestEntry, bytes: Uint8Array): LoadIssue | null => {
  if (bytes.length !== entry.length) {
    return makeIssue(LOAD_ERROR.ENTRY_CHECKSUM, `${entry.path} has ${bytes.length} bytes, expected ${entry.length}.`, entry.path);
  }
  return crc32(bytes) === entry.crc32
    ? null
    : makeIssue(LOAD_ERROR.ENTRY_CHECKSUM, `${entry.path} fails its checksum.`, entry.path);
};

const checkEntries = (manifest: Pick<Manifest, 'entries'>, archive: ArchiveContents): EntryCheck => {
  const good = new Map<string, Uint8Array>();
  const problems = new Map<string, LoadIssue>();
  for (const entry of manifest.entries) {
    const bytes = archive.files.get(entry.path);
    const problem = bytes ? verify(entry, bytes) : missingIssue(entry.path, archive);
    if (problem) problems.set(entry.path, problem);
    else if (bytes) good.set(entry.path, bytes);
  }
  return { good, problems };
};

export { checkEntries };
