/* @layer core @kind constants */

const PALETTE_LIMITS = {
  MAX_COLORS: 4096,
  GPL_HEADER: 'GIMP Palette',
  GPL_NAME_PREFIX: 'Name:',
  GPL_COLUMNS_PREFIX: 'Columns:',
  JASC_HEADER: 'JASC-PAL',
  JASC_VERSION: '0100',
  JASC_BREAK: '\r\n',
  GPL_BREAK: '\n',
  GPL_COLUMNS: 16,
  BOM: '﻿',
} as const;

export { PALETTE_LIMITS };
