/* @layer core @kind logic */
import type { LaunchApproval, SessionMode } from './trust.type';

const approveForLaunch = (
  launch: readonly LaunchApproval[],
  key: string,
  mode: SessionMode,
): readonly LaunchApproval[] => [...launch.filter((approval) => approval.key !== key), { key, mode }];

export { approveForLaunch };
