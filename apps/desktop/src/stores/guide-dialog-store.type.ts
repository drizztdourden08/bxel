/* @layer renderer-app @kind types */
import type { GuideAxis, GuideDialogRequest } from '../guides/guide.type';

interface GuideDialogState {
  open: boolean;
  axis: GuideAxis;
  from: number | null;
  position: number;
  show: (request: GuideDialogRequest) => void;
  hide: () => void;
}

export type { GuideDialogState };
