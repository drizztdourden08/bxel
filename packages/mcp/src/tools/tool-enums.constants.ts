/* @layer core @kind constants */
import { z } from 'zod';

const WINDOW_SCHEMA = z.enum(['headless', 'visible']);
const LAUNCHED_BY_SCHEMA = z.enum(['this_helper', 'other_helper', 'owner']);
const SESSION_MODE_SCHEMA = z.enum(['read', 'edit']);
const FILE_KIND_VALUES = ['bxel', 'image', 'palette', 'sheet_json', 'other'] as const;
const FILE_KIND_SCHEMA = z.enum(FILE_KIND_VALUES);
const DEFAULT_FILE_KINDS = ['bxel', 'image', 'palette', 'sheet_json'] as const;
const EXPORT_FORMAT_VALUES = ['png', 'png-indexed'] as const;
const NO_INPUT_SCHEMA = z.strictObject({});

export {
  DEFAULT_FILE_KINDS,
  EXPORT_FORMAT_VALUES,
  FILE_KIND_SCHEMA,
  LAUNCHED_BY_SCHEMA,
  NO_INPUT_SCHEMA,
  SESSION_MODE_SCHEMA,
  WINDOW_SCHEMA,
};
