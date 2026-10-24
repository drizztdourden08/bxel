/* @layer renderer-app @kind test */
import type { Point } from '@bxel/raster';
import { createDefaultProject } from '../../src/documents/create-default-project';
import { currentTarget } from '../../src/editor/current-target';
import type { EditorTarget, StrokeSession } from '../../src/editor/editor.type';
import { extendStroke } from '../../src/editor/extend-stroke';
import { startSession } from '../../src/editor/start-session';
import { TOOL_DEFAULTS } from '../../src/stores/tool-store.constants';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useToolStore } from '../../src/stores/useToolStore';

const live = (): EditorTarget => {
  const target = currentTarget();
  if (!target) throw new Error('the store holds no document');
  return target;
};

const flat = (): Uint8Array => {
  const { sprite, layerId } = live();
  const layer = sprite.layers.find((each) => each.id === layerId);
  const celId = layer ? Object.values(layer.cels)[0] : undefined;
  return celId === undefined ? new Uint8Array(0) : (sprite.cels[celId]?.pixels ?? new Uint8Array(0));
};

const tools = () => useToolStore.getState();

const penStroke = (start: Point, ...more: Point[]): StrokeSession => {
  const plan = { kind: 'stroke', tool: 'pencil', slot: 'foreground', line: false } as const;
  const session = startSession(plan, live(), start);
  if (session.kind !== 'stroke') throw new Error('expected a stroke');
  more.forEach((at) => extendStroke(session, at));
  return session;
};

const resetEditor = (): void => {
  useToolStore.setState({ ...TOOL_DEFAULTS });
  createDefaultProject(useDocumentStore.getState().host);
};

export { flat, live, penStroke, resetEditor, tools };
