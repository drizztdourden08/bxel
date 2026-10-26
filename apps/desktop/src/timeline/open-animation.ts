/* @layer renderer-app @kind logic */
import { useDocumentStore } from '../stores/useDocumentStore';
import { focusTab } from '../workspace/focus-tab';
import { tabOf } from '../workspace/tab-of';

const openAnimation = (animationId: string): void => {
  const { activeId } = useDocumentStore.getState();
  if (activeId !== null) focusTab(tabOf(activeId, { kind: 'animation', id: animationId }));
};

export { openAnimation };
