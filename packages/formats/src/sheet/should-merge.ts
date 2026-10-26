/* @layer core @kind logic */
import type { ExportSheetInput } from './export-sheet.type';

const shouldMerge = (input: Pick<ExportSheetInput, 'flavour' | 'mergeIdentical'>): boolean =>
  input.mergeIdentical === true && input.flavour !== 'tiled';

export { shouldMerge };
