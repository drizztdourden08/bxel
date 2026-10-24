/* @layer core @kind logic */
import { isSamePath } from '../paths/is-same-path';
import type { RecentProject } from './recent.type';

const dropRecentProject = (recent: readonly RecentProject[], rootRealPath: string): readonly RecentProject[] =>
  recent.filter((each) => !isSamePath(each.rootRealPath, rootRealPath));

export { dropRecentProject };
