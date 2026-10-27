/* @layer core @kind constants */
import { REMEMBERED_PROGRAMS_MAX } from '../limits/limits.constants';
import type { TrustStore } from './trust.type';

const TRUST_LEVELS = ['ask_every', 'ask_once_session', 'ask_once_remember', 'allow_all'] as const;
const SESSION_MODES = ['read', 'edit'] as const;
const PROGRAM_MODES = ['read', 'edit', 'blocked'] as const;
const PAIR_CHOICES = ['read', 'edit', 'full', 'blocked'] as const;
const PROGRAM_KEY_MAX = 64;
const PROGRAM_KEY_CONTROL = /\p{Cc}/u;
const PROGRAM_PROGRAMS_MAX = REMEMBERED_PROGRAMS_MAX;
const UNNAMED_PROGRAM = 'Unnamed program';

const DEFAULT_TRUST_STORE: TrustStore = {
  level: 'ask_once_remember',
  allowAllMode: 'read',
  programs: [],
};

export {
  DEFAULT_TRUST_STORE,
  PROGRAM_KEY_CONTROL,
  PAIR_CHOICES,
  PROGRAM_KEY_MAX,
  PROGRAM_MODES,
  PROGRAM_PROGRAMS_MAX,
  SESSION_MODES,
  TRUST_LEVELS,
  UNNAMED_PROGRAM,
};
