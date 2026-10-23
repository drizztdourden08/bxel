/* @layer core @kind types */
import type { FrameId, LayerId, SpriteId } from '../model/ids.type';
import type { ERROR_CODE } from './error-code.constants';

type ErrorCode = (typeof ERROR_CODE)[keyof typeof ERROR_CODE];

type TargetIssue = {
  readonly spriteId: SpriteId;
  readonly layerId: LayerId | null;
  readonly frameId: FrameId | null;
  readonly reason: string;
};

type CommandError = {
  readonly code: ErrorCode;
  readonly message: string;
  readonly step: number | null;
  readonly path: string | null;
  readonly details: readonly TargetIssue[];
};

type FailExtra = {
  readonly step?: number;
  readonly path?: string;
  readonly details?: readonly TargetIssue[];
};

export type { CommandError, ErrorCode, FailExtra, TargetIssue };
