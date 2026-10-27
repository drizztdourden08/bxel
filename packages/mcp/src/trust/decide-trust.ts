/* @layer core @kind logic */
import { grantOfMode } from '../grants/grant-of-mode';
import type { Grant } from '../grants/grant.type';
import { modeOfGrant } from '../grants/mode-of-grant';
import { programKey } from './program-key';
import type { HelloClient, LaunchApproval, SessionMode, TrustDecision, TrustEntry, TrustSource, TrustStore } from './trust.type';

const sessionModeOf = (grant: Grant): SessionMode => (modeOfGrant(grant) === 'edit' ? 'edit' : 'read');

const pair = (grant: Grant, trust: TrustSource): TrustDecision => ({ kind: 'pair', grant, mode: sessionModeOf(grant), trust });

const decideAllowAll = (store: TrustStore, entry: TrustEntry | undefined): TrustDecision =>
  entry?.grant.blocked === true ? { kind: 'deny' } : pair(grantOfMode(store.allowAllMode), 'allow_all');

const decideThisLaunch = (key: string, launch: readonly LaunchApproval[]): TrustDecision => {
  const approved = launch.find((approval) => approval.key === key);
  return approved ? pair(approved.grant, 'this_launch') : { kind: 'ask', remember: 'launch' };
};

const decideRemembered = (entry: TrustEntry | undefined): TrustDecision => {
  if (!entry) return { kind: 'ask', remember: 'saved' };
  return entry.grant.blocked ? { kind: 'deny' } : pair(entry.grant, 'remembered');
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
