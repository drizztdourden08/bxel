/* @layer renderer-app @kind logic */
import { COMMAND_NAME, ERROR_CODE } from '@bxel/document';
import type { Artwork } from '@bxel/document';
import { mcpFailure } from '@bxel/mcp';
import type { Failure } from '@bxel/mcp';
import { STRICT_TEXT } from '../../platform-preset/platform-preset.constants';
import type { WireStep } from './tool-input.type';

const changesSwitch = (artwork: Artwork, step: WireStep): boolean => {
  if (step.name !== COMMAND_NAME.artworkUpdate || typeof step.options !== 'object' || step.options === null) return false;
  const { platformStrict, platformId } = step.options as { platformStrict?: unknown; platformId?: unknown };
  const dropsStrict = platformStrict !== undefined && platformStrict !== true;
  const movesPlatform = platformId !== undefined && platformId !== (artwork.platformId ?? null);
  return dropsStrict || movesPlatform;
};

const platformLock = (artwork: Artwork, steps: readonly WireStep[]): Failure | null => {
  if (artwork.platformStrict !== true) return null;
  const at = steps.findIndex((step) => changesSwitch(artwork, step));
  return at < 0 ? null : mcpFailure(ERROR_CODE.PLATFORM_RULE, STRICT_TEXT.ownerOnly, { step: at, retry: 'after_owner' });
};

export { platformLock };
