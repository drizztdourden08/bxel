/* @layer renderer-app @kind component */
import { Callout } from '@drizztdourden08/tessera';
import type { SheetProblemProps } from '../PaletteSheetDialog.type';

const SheetProblem = ({ error, failure }: SheetProblemProps) => {
  const problem = failure ?? error;
  return problem === null ? null : <Callout tone={failure === null ? 'warning' : 'danger'}>{problem}</Callout>;
};

export { SheetProblem };
