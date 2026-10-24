/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import type { FrameId, LayerId, Sprite } from '@bxel/document';
import { createDefaultArtwork } from '../../src/documents/create-default-artwork';
import { commitRequest } from '../../src/editor/commit-request';
import { currentTarget } from '../../src/editor/current-target';
import type { EditorTarget } from '../../src/editor/editor.type';
import { addFrame } from '../../src/timeline/add-frame';
import { goToCel } from '../../src/timeline/go-to-cel';
import { goToFrame } from '../../src/timeline/go-to-frame';
import { TOOL_DEFAULTS } from '../../src/stores/tool-store.constants';
import { TIMELINE_DEFAULTS } from '../../src/stores/timeline-store.constants';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useNoticeStore } from '../../src/stores/useNoticeStore';
import { useTimelineStore } from '../../src/stores/useTimelineStore';
import { useToolStore } from '../../src/stores/useToolStore';

const live = (): EditorTarget => {
  const target = currentTarget();
  if (!target) throw new Error('the store holds no document');
  return target;
};

const frameIds = (): FrameId[] => live().sprite.frames.map((frame) => frame.id);

const frameAt = (index: number): FrameId => {
  const id = frameIds()[index];
  if (!id) throw new Error('the frame is missing');
  return id;
};

const layerIds = (): LayerId[] => live().sprite.layers.map((layer) => layer.id);

const durations = (): number[] => live().sprite.frames.map((frame) => frame.durationMs);

const revision = (): number => live().revision;

const noticeText = (): string | undefined => useNoticeStore.getState().notice?.text;

const freshDocument = (): void => {
  useNoticeStore.setState({ notice: null });
  useToolStore.setState({ ...TOOL_DEFAULTS });
  createDefaultArtwork(useDocumentStore.getState().host);
  useTimelineStore.setState({ ...TIMELINE_DEFAULTS });
};

const withFrames = (total: number): FrameId[] => {
  for (let count = 1; count < total; count += 1) addFrame();
  goToFrame(frameAt(0));
  return frameIds();
};

const paintCel = (frameAt: number, x: number, index: number, layerAt = 0): void => {
  const { host, activeId } = useDocumentStore.getState();
  const target = live();
  const frame = target.sprite.frames[frameAt];
  const layer = target.sprite.layers[layerAt];
  if (!frame || !layer || activeId === null) throw new Error('the cel is missing');
  const scope = { sprites: [target.sprite.id], layers: { by: 'ids', ids: [layer.id] }, frames: { by: 'ids', ids: [frame.id] } } as const;
  const options = { points: [{ x, y: 0 }], brush: { shape: 'square', size: 1 }, index };
  const result = host.execute(commitRequest(target, 'Paint', { name: COMMAND_NAME.pixelsPaint, options }, scope));
  if (!result.ok) throw new Error(result.error.message);
};

const pickRange = (first: number, last: number): void => {
  const ids = frameIds();
  const from = ids[first];
  const to = ids[last];
  if (!from || !to) throw new Error('the frame is missing');
  goToFrame(from);
  goToFrame(to, true);
};

const pickCels = (from: { layer: number; frame: number }, to: { layer: number; frame: number }): void => {
  const frames = frameIds();
  const layers = layerIds();
  const first = { layerId: layers[from.layer], frameId: frames[from.frame] };
  const last = { layerId: layers[to.layer], frameId: frames[to.frame] };
  if (!first.layerId || !first.frameId || !last.layerId || !last.frameId) throw new Error('the cel is missing');
  goToCel({ layerId: first.layerId, frameId: first.frameId });
  goToCel({ layerId: last.layerId, frameId: last.frameId }, true);
};

const celAt = (sprite: Sprite, layerIndex: number, frameIndex: number): string | undefined => {
  const frame = sprite.frames[frameIndex];
  return frame ? sprite.layers[layerIndex]?.cels[frame.id] : undefined;
};

export { celAt, durations, frameAt, frameIds, freshDocument, layerIds, live, noticeText, paintCel, pickCels, pickRange, revision, withFrames };
