/* @layer core @kind constants */

const PAINT_NET = {
  COMMENT: ';',
  NAME_PREFIX: 'Palette Name:',
  HEADER: '; paint.net Palette File',
  COLORS_PREFIX: 'Colors:',
  BREAK: '\r\n',
  LINE: /^[0-9a-f]{8}$/i,
} as const;

export { PAINT_NET };
