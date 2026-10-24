/* @layer renderer-app @kind logic */
import type { SpriteId } from '@bxel/document';
import { findIdentical } from './find-identical';
import { NO_TWINS } from './identical.constants';
import type { IdenticalMode } from './identical.type';
import type { SpriteFacts } from './manager.type';

const twinIds = (facts: readonly SpriteFacts[], mode: IdenticalMode): ReadonlySet<SpriteId> =>
  mode === 'off' ? NO_TWINS : new Set(findIdentical(facts.map((fact) => fact.sprite), mode === 'flips').flat());

export { twinIds };
