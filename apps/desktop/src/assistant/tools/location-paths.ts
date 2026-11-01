/* @layer renderer-app @kind logic */
import type { McpResult } from '@bxel/mcp';
import type { ToolContext } from '../assistant.type';
import { locationPath } from './location-path';
import type { LocationLike } from './location-path.type';

const locationPaths = (context: ToolContext, places: readonly LocationLike[], field: string): McpResult<readonly string[]> => {
  const paths: string[] = [];
  for (const [at, place] of places.entries()) {
    const path = locationPath(context, place, `${field}.${at}`);
    if (!path.ok) return path;
    paths.push(path.value);
  }
  return { ok: true, value: paths };
};

export { locationPaths };
