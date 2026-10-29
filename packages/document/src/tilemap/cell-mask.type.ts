/* @layer core @kind types */
import type { z } from 'zod';
import type { cellMaskSchema } from '../schema/cell-mask-schema';

type CellMaskDescriptor = z.output<typeof cellMaskSchema>;

type CellMaskOp = Extract<CellMaskDescriptor, { by: 'combine' }>['op'];

type CellView = {
  readonly columns: number;
  readonly rows: number;
  readonly cells: Uint32Array;
};

export type { CellMaskDescriptor, CellMaskOp, CellView };
