/* @layer renderer-app @kind component */
import type { RowCells as RowCellValues } from '../../../project-browser/project-browser.type';
import { RowCellText } from './RowCellText';

const RowCells = ({ cells }: { readonly cells: RowCellValues }) => (
  <>
    <RowCellText value={cells.kind} />
    <RowCellText value={cells.size} suffix="size" />
    <RowCellText value={cells.frames} suffix="frames" />
    <RowCellText value={cells.palette} suffix="palette" />
    <RowCellText value={cells.folder} suffix="folder" />
    <RowCellText value={cells.modified} suffix="modified" />
    <RowCellText value={cells.users} suffix="users" />
  </>
);

export { RowCells };
