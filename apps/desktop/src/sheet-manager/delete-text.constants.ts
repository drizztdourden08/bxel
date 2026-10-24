/* @layer renderer-app @kind constants */
import { plural } from './plural';

const DELETE_TEXT = {
  title: (count: number): string => (count === 1 ? 'Delete sprite' : `Delete ${count} sprites`),
  confirm: 'Delete',
  unused: 'Not on a sheet or in a tilemap',
  usage: (sheets: number, tilemaps: number): string =>
    [sheets > 0 ? `On ${plural(sheets, 'sheet')}` : '', tilemaps > 0 ? `In ${plural(tilemaps, 'tilemap')}` : ''].filter(Boolean).join(', '),
  summary: (used: number, total: number): string =>
    used === 0
      ? 'None of these sprites is on a sheet or in a tilemap. You can undo this.'
      : `${used} of ${plural(total, 'sprite')} ${used === 1 ? 'is' : 'are'} used. Deleting takes them off the sheets and tilemaps too. You can undo this.`,
} as const;

export { DELETE_TEXT };
