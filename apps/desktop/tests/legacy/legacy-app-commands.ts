/* @layer renderer-app @kind test */
import { documentCommands, legacyFrameCommands } from '@bxel/document';
import type { CommandDef } from '@bxel/document';
import { paletteCommands } from '@bxel/palette';
import { legacyRasterCommands, rasterCommands } from '@bxel/raster';
import { guardCommand } from '../../src/platform-preset/guard-command';

const LEGACY_APP_COMMANDS: readonly CommandDef[] = [
  ...documentCommands,
  ...legacyFrameCommands,
  ...paletteCommands,
  ...rasterCommands,
  ...legacyRasterCommands,
].map(guardCommand);

const legacyAppCommands = (): { APP_COMMANDS: readonly CommandDef[] } => ({ APP_COMMANDS: LEGACY_APP_COMMANDS });

export { LEGACY_APP_COMMANDS, legacyAppCommands };
