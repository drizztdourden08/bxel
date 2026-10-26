/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import type { AnimFrameId, Animation, AnimationId, DocumentId } from '@bxel/document';
import { createDefaultArtwork } from '../../src/documents/create-default-artwork';
import { commitRequest } from '../../src/editor/commit-request';
import { currentTarget } from '../../src/editor/current-target';
import type { EditorTarget } from '../../src/editor/editor.type';
import { TOOL_DEFAULTS } from '../../src/stores/tool-store.constants';
import { TIMELINE_DEFAULTS } from '../../src/stores/timeline-store.constants';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useNoticeStore } from '../../src/stores/useNoticeStore';
import { useTimelineStore } from '../../src/stores/useTimelineStore';
import { useToolStore } from '../../src/stores/useToolStore';
import { useWorkspaceStore } from '../../src/stores/useWorkspaceStore';
import { currentFocus } from '../../src/timeline/current-focus';
import { goToFrame } from '../../src/timeline/go-to-frame';
import { runSteps } from '../../src/transactions/run-steps';
import { focusTab } from '../../src/workspace/focus-tab';
import { tabOf } from '../../src/workspace/tab-of';
import { watchWorkspaces } from '../../src/workspace/watch-workspaces';

watchWorkspaces();

const SIDE = 8;

const live = () => {
  const focus = currentFocus();
  if (!focus) throw new Error('no animation is open');
  return focus;
};

const animationOf = (): Animation => live().animation;

const frameIds = (): AnimFrameId[] => animationOf().frames.map((frame) => frame.id);

const frameAt = (index: number): AnimFrameId => {
  const id = frameIds()[index];
  if (!id) throw new Error('the frame is missing');
  return id;
};

const durations = (): number[] => animationOf().frames.map((frame) => frame.durationMs);

const noticeText = (): string | undefined => useNoticeStore.getState().notice?.text;

const run = (label: string, steps: Parameters<typeof runSteps>[3]) => {
  const { host, activeId } = useDocumentStore.getState();
  if (activeId === null) throw new Error('no document');
  const done = runSteps(host, activeId, label, steps);
  if (!done.ok) throw new Error(done.error.message);
  return done;
};

const freshAnimation = (frames = 1): { documentId: DocumentId; animationId: AnimationId } => {
  useNoticeStore.setState({ notice: null });
  useToolStore.setState({ ...TOOL_DEFAULTS });
  useWorkspaceStore.setState({ workspaces: {}, tabs: [], activeTab: null });
  const { host } = useDocumentStore.getState();
  for (const id of host.list()) host.close(id);
  const documentId = createDefaultArtwork(host);
  useDocumentStore.getState().setActive(documentId);
  const made = runSteps(host, documentId, 'Animation', [
    { name: COMMAND_NAME.animationCreate, targets: null, options: { name: 'walk', source: { kind: 'blank', width: SIDE, height: SIDE, frames } }, ref: 'anim' },
    ...Array.from({ length: frames }, (_unused, index) => ({
      name: COMMAND_NAME.animationFrameOwn,
      targets: null,
      options: { animation: { ref: 'anim' }, frame: { by: 'index', index } },
    })),
  ]);
  if (!made.ok) throw new Error(made.error.message);
  const animationId = made.created['anim'] as AnimationId;
  focusTab(tabOf(documentId, { kind: 'animation', id: animationId }));
  useTimelineStore.setState({ ...TIMELINE_DEFAULTS });
  return { documentId, animationId };
};

const withFrames = (total: number): AnimFrameId[] => {
  freshAnimation(total);
  goToFrame(frameAt(0));
  return frameIds();
};

const target = (): EditorTarget => {
  const found = currentTarget();
  if (!found) throw new Error('the frame has no sprite');
  return found;
};

const paintFrame = (frameIndex: number, x: number, y: number, index: number): void => {
  goToFrame(frameAt(frameIndex));
  const painted = target();
  const { host } = useDocumentStore.getState();
  const scope = { sprites: [painted.sprite.id], layers: { by: 'ids', ids: [painted.layerId] }, frames: { by: 'ids', ids: [painted.frameId] } } as const;
  const options = { points: [{ x, y }], brush: { shape: 'square', size: 1 }, index };
  const result = host.execute(commitRequest(painted, 'Paint', { name: COMMAND_NAME.pixelsPaint, options }, scope));
  if (!result.ok) throw new Error(result.error.message);
};

const pickRange = (first: number, last: number): void => {
  goToFrame(frameAt(first));
  goToFrame(frameAt(last), true);
};

const revision = (): number => useDocumentStore.getState().host.view(live().documentId)?.state.revision ?? 0;

export { animationOf, durations, frameAt, frameIds, freshAnimation, live, noticeText, paintFrame, pickRange, revision, run, SIDE, target, withFrames };
