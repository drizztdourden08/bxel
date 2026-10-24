/* @layer renderer-app @kind logic */
import { joinInside } from '@bxel/project';

const folderDir = (folderPath: string, segments: readonly string[]): string | null => {
  if (segments.length === 0) return folderPath;
  const joined = joinInside(folderPath, segments.join('/'));
  return joined.ok ? joined.value : null;
};

export { folderDir };
