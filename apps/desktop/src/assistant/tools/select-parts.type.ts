/* @layer renderer-app @kind types */
import type { Artwork } from '@bxel/document';
import type { ToolReply } from '@bxel/mcp';
import type { SetViewInput } from './app-tool-input.type';

type SelectPatch = NonNullable<SetViewInput['select']>;

type SelectPart = (select: SelectPatch, artwork: Artwork) => ToolReply | null;

export type { SelectPart };
