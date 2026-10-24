/* @layer core @kind logic */
import { isSamePath } from '../paths/is-same-path';
import { MAX_RECENT_PROJECTS } from './recent.constants';
import type { RecentProject } from './recent.type';

const pushRecentProject = (recent: readonly RecentProject[], entry: RecentProject): readonly RecentProject[] => {
  const others = recent.filter((each) => !isSamePath(each.rootRealPath, entry.rootRealPath));
  return [entry, ...others].slice(0, MAX_RECENT_PROJECTS);
};

export { pushRecentProject };
