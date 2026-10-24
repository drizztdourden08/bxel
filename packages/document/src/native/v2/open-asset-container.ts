/* @layer core @kind logic */
import { strFromU8 } from 'fflate';
import { assetManifestSchema } from '../../schema/asset-manifest-schema';
import type { AssetKind } from '../../model/asset.type';
import type { ArchiveContents } from '../archive.type';
import { ENTRY } from '../container.constants';
import { gateVersions } from '../gate-versions';
import { LOAD_ERROR } from '../load-error.constants';
import { makeIssue } from '../make-issue';
import { parseManifestWith } from '../parse-manifest-with';
import type { Parsed } from '../parsed.type';
import { readEntries } from '../read-entries';
import { ASSET_DOCUMENT_ENTRY, ASSET_FORMAT_VERSION, LEGACY_FILE_MESSAGE } from './asset-container.constants';
import type { AssetManifest } from './asset-manifest.type';
import type { DetectedKind } from './detected-kind.type';
import { mimeKind } from './mime-kind';
import type { OpenedAsset } from './opened-asset.type';

const refuse = (code: keyof typeof LOAD_ERROR, message: string, path: string | null = null): Parsed<OpenedAsset> => ({
  ok: false,
  issues: [makeIssue(LOAD_ERROR[code], message, path)],
});

const kindOf = (archive: ArchiveContents): DetectedKind | null => {
  const mimetype = archive.files.get(ENTRY.mimetype);
  return mimetype ? mimeKind(strFromU8(mimetype)) : null;
};

const wrongKind = (found: DetectedKind, expected: AssetKind): Parsed<OpenedAsset> =>
  found === 'legacy'
    ? refuse('WRONG_KIND', LEGACY_FILE_MESSAGE, ENTRY.mimetype)
    : refuse('WRONG_KIND', `This is a Bxel ${found} file, not a ${expected} file.`, ENTRY.mimetype);

const mismatch = (manifest: AssetManifest, kind: AssetKind): string | null => {
  if (manifest.kind !== kind) return 'kind';
  return manifest.document === ASSET_DOCUMENT_ENTRY[kind] ? null : 'document';
};

const openAssetContainer = (bytes: Uint8Array, expected: AssetKind): Parsed<OpenedAsset> => {
  const read = readEntries(bytes);
  if (!read.ok) return { ok: false, issues: [read.issue] };
  const found = kindOf(read.archive);
  if (found === null) return refuse('FILE_NOT_BXEL', 'The archive is not a Bxel file.', ENTRY.mimetype);
  if (found !== expected) return wrongKind(found, expected);
  const manifest = parseManifestWith(read.archive, assetManifestSchema);
  if (!manifest.ok) return manifest;
  const wrong = mismatch(manifest.value, expected);
  if (wrong) return refuse('MANIFEST_INVALID', `The manifest ${wrong} does not match the mimetype.`, `$.${wrong}`);
  const gate = gateVersions(manifest.value, ASSET_FORMAT_VERSION);
  if (gate.issue) return { ok: false, issues: [gate.issue] };
  return { ok: true, value: { archive: read.archive, manifest: manifest.value, readOnly: gate.readOnly, notice: gate.notice } };
};

export { openAssetContainer };
