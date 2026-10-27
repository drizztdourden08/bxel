/* @layer core @kind logic */
import type { Grant } from '../grants/grant.type';
import type { LaunchApproval } from './trust.type';

const approveForLaunch = (
  launch: readonly LaunchApproval[],
  key: string,
  grant: Grant,
): readonly LaunchApproval[] => [...launch.filter((approval) => approval.key !== key), { key, grant }];

export { approveForLaunch };
