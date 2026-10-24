/* @layer renderer-app @kind types */
import type { ChangeRequest } from '../palette-change/palette-change.type';

interface ChangeState {
  request: ChangeRequest | null;
  propose: (request: ChangeRequest) => void;
  setOther: (other: number | null) => void;
  setCap: (cap: number) => void;
  setTarget: (toBankId: ChangeRequest['toBankId']) => void;
  hide: () => void;
}

export type { ChangeState };
