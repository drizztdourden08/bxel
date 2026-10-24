/* @layer renderer-app @kind logic */
import { COMMAND_NAME, ERROR_CODE } from '@bxel/document';
import type { Artwork } from '@bxel/document';
import { mcpFailure } from '@bxel/mcp';
import type { Failure } from '@bxel/mcp';
import { STRICT_TEXT } from '../../platform-preset/platform-preset.constants';
import type { PlatformOptions, WireStep } from './tool-input.type';

const movesArtworkSwitch = (artwork: Artwork, options: PlatformOptions): boolean => {
  const { platformStrict, platformId } = options;
  const dropsStrict = platformStrict !== undefined && platformStrict !== true;
  const movesPlatform = platformId !== undefined && platformId !== (artwork.platformId ?? null);
  return dropsStrict || movesPlatform;
};

const touchesSpriteSwitch = (options: PlatformOptions): boolean => options.platformId !== undefined || options.platformStrict !== undefined;

const changesSwitch = (artwork: Artwork, step: WireStep): boolean => {
  if (typeof step.options !== 'object' || step.options === null) return false;
  const options = step.options as PlatformOptions;
  if (step.name === COMMAND_NAME.artworkUpdate) return movesArtworkSwitch(artwork, options);
  return step.name === COMMAND_NAME.spriteUpdate && touchesSpriteSwitch(options);
};

const anyStrict = (artwork: Artwork): boolean => artwork.platformStrict === true || artwork.sprites.some((sprite) => sprite.platformStrict === true);

const platformLock = (artwork: Artwork, steps: readonly WireStep[]): Failure | null => {
  if (!anyStrict(artwork)) return null;
  const at = steps.findIndex((step) => changesSwitch(artwork, step));
  return at < 0 ? null : mcpFailure(ERROR_CODE.PLATFORM_RULE, STRICT_TEXT.ownerOnly, { step: at, retry: 'after_owner' });
};

export { platformLock };
