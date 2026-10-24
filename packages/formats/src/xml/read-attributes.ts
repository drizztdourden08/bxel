/* @layer core @kind logic */
import { decodeEntities } from './decode-entities';
import { XML_ATTRIBUTE } from './xml.constants';

const readAttributes = (source: string): Record<string, string> => {
  const attrs: Record<string, string> = {};
  for (const match of source.matchAll(XML_ATTRIBUTE)) {
    const name = match[1];
    if (name !== undefined) attrs[name] = decodeEntities(match[2] ?? match[3] ?? '');
  }
  return attrs;
};

export { readAttributes };
