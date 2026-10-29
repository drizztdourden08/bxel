/* @layer renderer-app @kind logic */
import type { DragEntry } from '../../../sheet-manager/drag-payload.type';
import { assetPathOf } from '../../../sheet-manager/asset-path-of';
import type { ManagerModel } from '../SpritesPanel.type';

const spriteEntry = (id: string): DragEntry => ({ kind: 'sprite', assetId: id, path: assetPathOf(id) });

const animationEntry = (model: ManagerModel, key: string): DragEntry[] => {
  const fact = model.animationFacts.find((each) => each.key === key);
  return fact ? [{ kind: 'animation', assetId: fact.animation.id, tagId: fact.tagId, path: assetPathOf(fact.animation.id) }] : [];
};

const dragEntriesOf = (model: ManagerModel, key: string): DragEntry[] => {
  const inPick = model.ids.some((id) => id === key) || model.picked.includes(key);
  if (!inPick) return model.animationFacts.some((fact) => fact.key === key) ? animationEntry(model, key) : [spriteEntry(key)];
  const picked = new Set<string>(model.ids);
  return [
    ...model.order.filter((id) => picked.has(id)).map(spriteEntry),
    ...model.animations.filter((fact) => model.picked.includes(fact.key)).flatMap((fact) => animationEntry(model, fact.key)),
  ];
};

export { dragEntriesOf };
