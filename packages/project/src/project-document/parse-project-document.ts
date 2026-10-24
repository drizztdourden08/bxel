/* @layer core @kind logic */
import type { ProjectResult } from '../errors/project-result.type';
import type { ProjectDocument } from './project-document.type';
import { parseJsonText } from './parse-json-text';
import { parseProjectDocumentValue } from './parse-project-document-value';

const parseProjectDocument = (text: string): ProjectResult<ProjectDocument> => {
  const json = parseJsonText(text);
  return json.ok ? parseProjectDocumentValue(json.value) : json;
};

export { parseProjectDocument };
