/* @layer renderer-app @kind logic */
import { currentReferences } from '../../reference-image/current-references';
import { useReferenceStore } from '../../stores/useReferenceStore';

const referencesView = () => {
  const { entries } = useReferenceStore.getState();
  return currentReferences().map((each) => {
    const entry = entries[each.key];
    return {
      id: each.id,
      name: each.name,
      x: each.x,
      y: each.y,
      scale: each.scale,
      opacity: each.opacity,
      above: each.above,
      locked: each.locked,
      state: entry?.state ?? 'loading',
    };
  });
};

export { referencesView };
