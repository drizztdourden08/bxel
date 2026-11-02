/* @layer renderer-app @kind constants */

const ENTRY_WARNING_TEXT = {
  palette: (bank: string, sheetBank: string): string => `Palette ${bank} differs from ${sheetBank}, the palette of the sheet export`,
  page: (width: number, height: number, side: number): string => `${width} by ${height} is larger than a ${side} by ${side} page`,
} as const;

export { ENTRY_WARNING_TEXT };
