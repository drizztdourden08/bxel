/* @layer core @kind logic */
import type { Draft } from '../../draft/draft.type';
import { requireSprite } from '../../read/require-sprite';
import type { TargetScope } from '../../scope/target-scope.type';
import { pickSheet } from '../sheet/pick-sheet';
import { resolveRefId } from '../tilemap/resolve-ref-id';
import type { OwnerFields } from './owner-fields.type';
import type { PresetOwner } from './preset-owner.type';

const scopeOf = (sprites: TargetScope['sprites']): TargetScope => ({ sprites, layers: { by: 'all' }, frames: { by: 'all' } });

const ownerFields = (draft: Draft, owner: PresetOwner): OwnerFields => {
  if ('sheet' in owner) return { sheetId: pickSheet(draft, owner.sheet).id, scope: scopeOf([]) };
  if ('sprite' in owner) {
    const sprite = requireSprite(draft.artwork, resolveRefId(draft, owner.sprite, 'options.owner.sprite'));
    return { sheetId: null, scope: scopeOf([sprite.id]) };
  }
  return { sheetId: null, scope: scopeOf([]) };
};

export { ownerFields };
