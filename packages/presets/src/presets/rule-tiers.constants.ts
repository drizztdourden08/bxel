/* @layer core @kind constants */
import type { RuleTiers } from '../model/preset.type';

const TIERS_STRICT: RuleTiers = {
  bankSize: 'enforce',
  bankCount: 'enforce',
  slot0: 'enforce',
  colour: 'enforce',
  spriteSize: 'enforce',
  area: 'warn',
};

const TIERS_OPEN_SLOT0: RuleTiers = {
  bankSize: 'enforce',
  bankCount: 'enforce',
  slot0: 'advisory',
  colour: 'enforce',
  spriteSize: 'enforce',
  area: 'warn',
};

const TIERS_FREE: RuleTiers = {
  bankSize: 'enforce',
  bankCount: 'enforce',
  slot0: 'advisory',
  colour: 'enforce',
  spriteSize: 'advisory',
  area: 'advisory',
};

export { TIERS_FREE, TIERS_OPEN_SLOT0, TIERS_STRICT };
