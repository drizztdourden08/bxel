/* @layer renderer-app @kind types */
import type { Session } from './e2e.type';
import type { ClientConfig, McpLink } from './mcp.type';

type McpRig = {
  readonly session: Session;
  readonly link: McpLink;
  readonly config: ClientConfig;
  readonly folder: string;
  readonly sessionId: string;
};

type DrawnSprite = {
  readonly documentId: string;
  readonly spriteId: string;
  readonly layerId: string;
  readonly frameId: string;
  readonly revision: number;
};

export type { DrawnSprite, McpRig };
