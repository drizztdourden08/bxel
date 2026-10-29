/* @layer renderer-app @kind types */
import type { McpResult } from '@bxel/mcp';
import type { FramePng } from './tool-input.type';

type PngReplyInput = {
  readonly png: McpResult<FramePng>;
  readonly render: { readonly revision: number; readonly scale: number; readonly uri: string };
  readonly hashOf: (png: FramePng) => Promise<string>;
  readonly extra?: Readonly<Record<string, unknown>>;
};

export type { PngReplyInput };
