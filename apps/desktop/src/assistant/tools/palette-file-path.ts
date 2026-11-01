/* @layer renderer-app @kind logic */
import type { McpResult } from '@bxel/mcp';
import { fileExtension } from '../../files/file-extension';
import type { ToolContext } from '../assistant.type';
import { PALETTE_READ_EXTENSIONS } from './import-extensions.constants';
import { locatedPath } from './located-path';
import type { ProjectLocation } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';

const paletteFilePath = (context: ToolContext, location: ProjectLocation): Promise<McpResult<string>> =>
  locatedPath(context, location, (path) => PALETTE_READ_EXTENSIONS.includes(fileExtension(path)), TOOL_TEXT.paletteFileMissing);

export { paletteFilePath };
