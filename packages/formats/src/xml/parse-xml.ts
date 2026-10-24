/* @layer core @kind logic */
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import { decodeEntities } from './decode-entities';
import { openTag } from './open-tag';
import { XML_LIMITS, XML_TOKEN } from './xml.constants';
import type { XmlResult } from './xml.type';
import type { XmlState } from './xml-state.type';

const bad = (message: string): XmlResult => formatFail(FORMAT_ERROR_CODE.TILED_INVALID, message);

const closeTag = (state: XmlState, name: string): string | null => {
  const done = state.stack.pop();
  return done?.name === name ? null : `The XML closing tag ${name} does not match.`;
};

const feed = (state: XmlState, match: RegExpExecArray): string | null => {
  const [, cdata, closing, opening, attributes, selfClosing, text] = match;
  if (opening !== undefined) return openTag(state, opening, attributes ?? '', selfClosing === '/');
  if (closing !== undefined) return closeTag(state, closing);
  const top = state.stack.at(-1);
  if (top) top.text += cdata ?? decodeEntities(text ?? '');
  return null;
};

const parseXml = (source: string): XmlResult => {
  if (source.length > XML_LIMITS.MAX_CHARS) return bad('The XML file is too large.');
  const state: XmlState = { stack: [], root: null, count: 0 };
  XML_TOKEN.lastIndex = 0;
  while (XML_TOKEN.lastIndex < source.length) {
    const match = XML_TOKEN.exec(source);
    if (!match) return bad('The XML file is not well formed.');
    const problem = feed(state, match);
    if (problem !== null) return bad(problem);
  }
  return state.stack.length > 0 || state.root === null ? bad('The XML file ends early.') : { ok: true, root: state.root };
};

export { parseXml };
