/* @layer core @kind logic */
import { projectOk } from '../errors/project-ok';
import type { ProjectResult } from '../errors/project-result.type';
import { parseManifest } from '../manifest/parse-manifest';
import { PROJECT_DOCUMENT_VERSION } from './project-document.constants';
import { parseJsonText } from './parse-json-text';
import { parseProjectDocumentValue } from './parse-project-document-value';
import type { ReadManifest } from './read-manifest.type';

const isVersionTwo = (value: unknown): boolean =>
  typeof value === 'object' && value !== null && (value as { formatVersion?: unknown }).formatVersion === PROJECT_DOCUMENT_VERSION;

const readManifest = (text: string): ProjectResult<ReadManifest> => {
  const json = parseJsonText(text);
  if (!json.ok) return json;
  if (isVersionTwo(json.value)) {
    const parsed = parseProjectDocumentValue(json.value);
    return parsed.ok ? projectOk({ version: 2, manifest: parsed.value }) : parsed;
  }
  const legacy = parseManifest(text);
  return legacy.ok ? projectOk({ version: 1, manifest: legacy.value }) : legacy;
};

export { readManifest };
