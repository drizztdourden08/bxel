/* @layer renderer-app @kind constants */
import { documentCommands } from '@bxel/document';
import type { CommandDef } from '@bxel/document';
import { paletteCommands } from '@bxel/palette';
import { rasterCommands } from '@bxel/raster';
import { guardCommand } from '../platform-preset/guard-command';

const APP_COMMANDS: readonly CommandDef[] = [...documentCommands, ...paletteCommands, ...rasterCommands].map(guardCommand);

export { APP_COMMANDS };
