/* @layer renderer-app @kind types */
import type { SplitPlan } from '@bxel/document';
import type { SplitDestination } from '../../workspace/workspace.type';

type SplitDialogModel = {
  readonly plan: SplitPlan | null;
  readonly destination: SplitDestination;
  readonly setDestination: (destination: SplitDestination) => void;
  readonly hasProject: boolean;
  readonly busy: boolean;
  readonly error: string | null;
  readonly run: () => void;
  readonly close: () => void;
};

export type { SplitDialogModel };
