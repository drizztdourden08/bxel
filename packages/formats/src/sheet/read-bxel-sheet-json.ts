/* @layer core @kind logic */
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import type { FormatFailure } from '../failure/format.type';
import { isRecord } from './is-record';
import { isValidMetadata } from './is-valid-metadata';
import { parseJsonText } from './parse-json-text';
import { readIntegers } from './read-integers';
import { readJsonList } from './read-json-list';
import { readJsonSprite } from './read-json-sprite';
import { SHEET_JSON } from './sheet-json.constants';
import type { SheetMetadata, SheetMetadataResult } from './sheet-metadata.type';

const bad = (message: string): FormatFailure =>
  formatFail(FORMAT_ERROR_CODE.SHEET_INVALID_JSON, message);

const build = (root: Readonly<Record<string, unknown>>): SheetMetadata | undefined => {
  const size = readIntegers(root['size'], ['w', 'h']);
  const sprites = readJsonList(root['sprites'], readJsonSprite);
  const { image, scale } = root;
  if (!size || !sprites || typeof image !== 'string') return undefined;
  if (typeof scale !== 'number' || !Number.isInteger(scale)) return undefined;
  const [width = 0, height = 0] = size;
  return { image, width, height, scale, sprites };
};

const readBxelSheetJson = (text: string): SheetMetadataResult => {
  const parsed = parseJsonText(text);
  if (!parsed) return bad('The text is not valid JSON');
  const root = parsed.value;
  if (!isRecord(root) || root['format'] !== SHEET_JSON.FORMAT) return bad('Not a Bxel sheet file');
  if (root['version'] !== SHEET_JSON.VERSION) return bad('Unsupported Bxel sheet version');
  const metadata = build(root);
  if (!metadata || !isValidMetadata(metadata)) return bad('The sheet metadata is malformed');
  return { ok: true, metadata };
};

export { readBxelSheetJson };
