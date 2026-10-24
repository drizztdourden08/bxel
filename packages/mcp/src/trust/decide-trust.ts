/* @layer core @kind logic */
import { programKey } from './program-key';
import type {
  HelloClient,
  LaunchApproval,
  SessionMode,
  TrustDecision,
  TrustEntry,
  TrustSource,
  TrustStore,
} from './trust.type';

const pair = (mode: SessionMode, trust: TrustSource): TrustDecision => ({ kind: 'pair', mode, trust });

const decideAllowAll = (store: TrustStore, entry: TrustEntry | undefined): TrustDecision =>
  entry?.mode === 'blocked' ? { kind: 'deny' } : pair(store.allowAllMode, 'allow_all');

const decideThisLaunch = (key: string, launch: readonly LaunchApproval[]): TrustDecision => {
  const approved = launch.find((approval) => approval.key === key);
  return approved ? pair(approved.mode, 'this_launch') : { kind: 'ask', remember: 'launch' };
};

const decideRemembered = (entry: TrustEntry | undefined): TrustDecision => {
  if (!entry) return { kind: 'ask', remember: 'saved' };
  return entry.mode === 'blocked' ? { kind: 'deny' } : pair(entry.mode, 'remembered');
};

const decideTrust = (
  client: HelloClient,
  store: TrustStore,
  launch: readonly LaunchApproval[] = [],
): TrustDecision => {
  const key = programKey(client.name);
  const entry = store.programs.find((program) => program.key === key);
  if (store.level === 'allow_all') return decideAllowAll(store, entry);
  if (key === null || store.level === 'ask_every') return { kind: 'ask', remember: 'none' };
  if (store.level === 'ask_once_session') return decideThisLaunch(key, launch);
  return decideRemembered(entry);
};

export { decideTrust };
