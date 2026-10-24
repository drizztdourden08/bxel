/* @layer core @kind logic */
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import type { FormatFailure } from '../failure/format.type';
import { parseXml } from '../xml/parse-xml';
import type { XmlNode } from '../xml/xml.type';
import { recOf } from './rec-of';
import type { Rec } from './rec.type';
import { BYTE_ORDER_MARK } from './tiled.constants';
import type { TextKind, TiledText } from './tiled.type';

const bad = (message: string): FormatFailure => formatFail(FORMAT_ERROR_CODE.TILED_INVALID, message);

const parseJson = (text: string): TiledText => {
  try {
    const value: unknown = JSON.parse(text);
    return { ok: true, record: recOf(value) };
  } catch {
    return bad('The file is not valid JSON.');
  }
};

const parseTiledText = (text: string, kind: TextKind, convert: (node: XmlNode) => Rec): TiledText => {
  const trimmed = (text.codePointAt(0) === BYTE_ORDER_MARK ? text.slice(1) : text).trimStart();
  if (trimmed.startsWith('{')) return parseJson(trimmed);
  if (!trimmed.startsWith('<')) return bad('The file is neither Tiled JSON nor Tiled XML.');
  const xml = parseXml(trimmed);
  if (!xml.ok) return xml;
  return xml.root.name === kind ? { ok: true, record: convert(xml.root) } : bad(`The XML file is not a Tiled ${kind}.`);
};

export { parseTiledText };
