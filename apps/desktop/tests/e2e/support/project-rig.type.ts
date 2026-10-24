/* @layer renderer-app @kind types */
import type { McpRig } from './mcp-rig.type';

type ProjectRig = McpRig & {
  readonly projectDir: string;
};

type AccessChoice = 'Off' | 'Read only' | 'Read and edit';

export type { AccessChoice, ProjectRig };
