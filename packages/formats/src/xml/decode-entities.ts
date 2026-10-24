/* @layer core @kind logic */
import { MAX_CODE_POINT, XML_ENTITY, XML_NAMED } from './xml.constants';

const entityText = (body: string): string => {
  const named = XML_NAMED[body];
  if (named !== undefined) return named;
  const code = body.startsWith('#x') ? Number.parseInt(body.slice(2), 16) : Number.parseInt(body.slice(1), 10);
  return code > 0 && code <= MAX_CODE_POINT ? String.fromCodePoint(code) : '';
};

const decodeEntities = (text: string): string =>
  text.includes('&') ? text.replace(XML_ENTITY, (_, body: string) => entityText(body)) : text;

export { decodeEntities };
