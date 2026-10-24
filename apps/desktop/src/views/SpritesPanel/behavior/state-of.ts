/* @layer renderer-app @kind logic */
import type { SpriteId } from '@bxel/document';
import type { SpriteFacts } from '../../../sheet-manager/manager.type';
import type { ManagerModel, SpriteState } from '../SpritesPanel.type';

const stateOf = (model: ManagerModel, fact: SpriteFacts, affected: readonly SpriteId[]): SpriteState => ({
  selected: model.scene.selected.some((each) => each.id === fact.sprite.id),
  active: model.scene.active?.id === fact.sprite.id,
  affected: affected.includes(fact.sprite.id),
  loose: model.sheet !== null && !fact.onSheet,
});

export { stateOf };
