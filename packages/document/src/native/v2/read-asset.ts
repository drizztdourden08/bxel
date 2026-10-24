/* @layer core @kind logic */
import type { AssetKind } from '../../model/asset.type';
import { absentIssue } from '../absent-issue';
import { checkEntries } from '../check-entries';
import { fatalEntryIssues } from '../fatal-entry-issues';
import { LOAD_ERROR } from '../load-error.constants';
import { parseJson } from '../parse-json';
import type { Parsed } from '../parsed.type';
import { openAssetContainer } from './open-asset-container';
import type { ReadAsset } from './read-asset.type';

const readAsset = (bytes: Uint8Array, kind: AssetKind): Parsed<ReadAsset> => {
  const opened = openAssetContainer(bytes, kind);
  if (!opened.ok) return opened;
  const { manifest, archive } = opened.value;
  const check = checkEntries(manifest, archive);
  const fatal = fatalEntryIssues(manifest, check);
  if (fatal.length > 0) return { ok: false, issues: fatal };
  const documentBytes = check.good.get(manifest.document);
  if (!documentBytes) return { ok: false, issues: [absentIssue(manifest.document, check.problems)] };
  const json = parseJson(documentBytes, LOAD_ERROR.DOCUMENT_INVALID, manifest.document);
  if (!json.ok) return json;
  return { ok: true, value: { opened: opened.value, check, json: json.value } };
};

export { readAsset };
