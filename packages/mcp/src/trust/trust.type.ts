/* @layer core @kind types */
import type { Grant } from '../grants/grant.type';
import type { PAIR_CHOICES, PROGRAM_MODES, SESSION_MODES, TRUST_LEVELS } from './trust.constants';

type TrustLevel = (typeof TRUST_LEVELS)[number];

type SessionMode = (typeof SESSION_MODES)[number];

type ProgramMode = (typeof PROGRAM_MODES)[number];

type PairChoice = (typeof PAIR_CHOICES)[number];

type TrustEntry = {
  readonly key: string;
  readonly displayName: string;
  readonly mode: ProgramMode;
  readonly grant: Grant;
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
  readonly grant: Grant;
};

type TrustSource = 'remembered' | 'this_launch' | 'allow_all';

type RememberChoice = 'none' | 'launch' | 'saved';

type TrustDecision =
  | { readonly kind: 'pair'; readonly grant: Grant; readonly mode: SessionMode; readonly trust: TrustSource }
  | { readonly kind: 'ask'; readonly remember: RememberChoice }
  | { readonly kind: 'deny' };

type TrustAnswer = {
  readonly choice: PairChoice;
  readonly remember: boolean;
};

type TrustState = {
  readonly store: TrustStore;
  readonly launch: readonly LaunchApproval[];
};

export type {
  HelloClient,
  LaunchApproval,
  PairChoice,
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
