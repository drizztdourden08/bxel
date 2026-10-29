/* @layer renderer-app @kind logic */
import type { SpriteId } from '@bxel/document';
import type { EntryFacts } from '../../../sheet-manager/manager.type';
import type { ManagerModel, SpriteState } from '../SpritesPanel.type';

const stateOf = (model: ManagerModel, fact: EntryFacts, affected: readonly SpriteId[], mark: SpriteState['mark'] = null): SpriteState => {
  if (fact.kind === 'animation') return { mark, selected: model.picked.includes(fact.key), active: false, affected: false, loose: false, twin: false };
  return {
    mark,
    selected: model.scene.selected.some((each) => each.id === fact.sprite.id),
    active: model.scene.active?.id === fact.sprite.id,
    affected: affected.includes(fact.sprite.id),
    loose: model.sheet !== null && !fact.onSheet,
    twin: model.twins.has(fact.sprite.id),
  };
};

export { stateOf };
