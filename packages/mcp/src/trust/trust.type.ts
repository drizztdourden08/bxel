/* @layer core @kind types */
import type { PROGRAM_MODES, SESSION_MODES, TRUST_LEVELS } from './trust.constants';

type TrustLevel = (typeof TRUST_LEVELS)[number];

type SessionMode = (typeof SESSION_MODES)[number];

type ProgramMode = (typeof PROGRAM_MODES)[number];

type TrustEntry = {
  readonly key: string;
  readonly displayName: string;
  readonly mode: ProgramMode;
  readonly firstApproved: string;
  readonly lastConnected: string;
  readonly lastVersion: string | null;
};

type TrustStore = {
  readonly level: TrustLevel;
  readonly allowAllMode: SessionMode;
  readonly programs: readonly TrustEntry[];
};

type HelloClient = {
  readonly name: string | null;
  readonly version: string | null;
};

type LaunchApproval = {
  readonly key: string;
  readonly mode: SessionMode;
};

type TrustSource = 'remembered' | 'this_launch' | 'allow_all';

type RememberChoice = 'none' | 'launch' | 'saved';

type TrustDecision =
  | { readonly kind: 'pair'; readonly mode: SessionMode; readonly trust: TrustSource }
  | { readonly kind: 'ask'; readonly remember: RememberChoice }
  | { readonly kind: 'deny' };

type TrustAnswer = {
  readonly mode: ProgramMode;
  readonly remember: boolean;
};

type TrustState = {
  readonly store: TrustStore;
  readonly launch: readonly LaunchApproval[];
};

export type {
  HelloClient,
  LaunchApproval,
  ProgramMode,
  RememberChoice,
  SessionMode,
  TrustAnswer,
  TrustDecision,
  TrustEntry,
  TrustLevel,
  TrustSource,
  TrustState,
  TrustStore,
};
