/* @layer core @kind logic */
import { strFromU8 } from 'fflate';
import { ENTRY, MIMETYPE } from './container.constants';
import { LOAD_ERROR } from './load-error.constants';
import { makeIssue } from './make-issue';
import type { OpenedContainer } from './opened-container.type';
import { parseManifest } from './parse-manifest';
import type { Parsed } from './parsed.type';
import { readEntries } from './read-entries';
import { versionGate } from './version-gate';

const notBxel = (): Parsed<OpenedContainer> => ({
  ok: false,
  issues: [makeIssue(LOAD_ERROR.FILE_NOT_BXEL, 'The archive is not a Bxel project.', ENTRY.mimetype)],
});

const openContainer = (bytes: Uint8Array): Parsed<OpenedContainer> => {
  const read = readEntries(bytes);
  if (!read.ok) return { ok: false, issues: [read.issue] };
  const { archive } = read;
  const mimetype = archive.files.get(ENTRY.mimetype);
  if (!mimetype || strFromU8(mimetype) !== MIMETYPE) return notBxel();
  const manifest = parseManifest(archive);
  if (!manifest.ok) return manifest;
  const gate = versionGate(manifest.value);
  if (gate.issue) return { ok: false, issues: [gate.issue] };
  return { ok: true, value: { archive, manifest: manifest.value, readOnly: gate.readOnly, notice: gate.notice } };
};

export { openContainer };
