/* @layer renderer-app @kind test */
import { PRESETS } from '@bxel/mcp';
import type { Grant, ToolName, ToolOutcome } from '@bxel/mcp';
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { vi } from 'vitest';
import type { ToolContext } from '../../src/assistant/assistant.type';
import { TOOL_HANDLERS } from '../../src/assistant/tool-handlers.constants';
import { createDefaultArtwork } from '../../src/documents/create-default-artwork';
import { storePathBook } from '../../src/files/store-path-book';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useSelectionStore } from '../../src/stores/useSelectionStore';
import { useSpriteStore } from '../../src/stores/useSpriteStore';
import { useToolStore } from '../../src/stores/useToolStore';
import { useViewStore } from '../../src/stores/useViewStore';
import { toolContext } from '../project/tool-context';

type FakeCommand = { id: string; label: string; enabled?: boolean; reason?: string | null; ran?: unknown[] };

const fake = {
  commands: [] as FakeCommand[],
  announced: [] as string[],
  opened: [] as string[],
  closed: 0,
  routes: [{ route: 'settings', title: 'Settings' }],
};

const panTo = vi.fn();
const setZoom = vi.fn();

const viewport = {
  screenToPixel: vi.fn(),
  pixelToScreen: vi.fn(),
  fit: vi.fn(),
  setZoom,
  zoomIn: vi.fn(),
  zoomOut: vi.fn(),
  redraw: vi.fn(),
  reveal: vi.fn(),
  panTo,
  view: () => ({ zoom: 4, pan: { x: 8, y: 8 }, originX: 0, originY: 0, width: 128, height: 128, dpr: 1, imageWidth: 16, imageHeight: 16 }),
};

const reset = (): void => {
  fake.commands = [];
  fake.announced = [];
  fake.opened = [];
  fake.closed = 0;
  panTo.mockClear();
  setZoom.mockClear();
  useSelectionStore.getState().setMask(null, null);
  useToolStore.setState({ tool: 'pencil', foreground: 1, background: 0, symmetryX: false, symmetryY: false, axisX: null, axisY: null, brushSize: 1 });
  useViewStore.setState({ viewport: null, grid: false, tiled: 'off' });
  useSpriteStore.getState().reset();
  for (const id of useDocumentStore.getState().host.list()) useDocumentStore.getState().host.close(id);
  useDocumentStore.getState().setActive(null);
};

const openDocument = (): string => {
  const { host, setActive } = useDocumentStore.getState();
  const documentId = createDefaultArtwork(host);
  setActive(documentId);
  return documentId;
};

const contextWith = (grant: Grant = PRESETS.full_control.grant, window: 'visible' | 'headless' = 'visible'): ToolContext => {
  const { host } = useDocumentStore.getState();
  const base = toolContext({ host, paths: storePathBook(host), documents: {} as DocumentsPort });
  return { ...base, call: { ...base.call, session: { ...base.call.session, grant }, instance: { ...base.call.instance, window } } };
};

const call = async (tool: ToolName, input: unknown, context: ToolContext = contextWith()): Promise<ToolOutcome> => {
  const handler = TOOL_HANDLERS[tool];
  if (!handler) throw new Error(`no handler for ${tool}`);
  return (await handler(input, context)).outcome;
};

export { call, contextWith, fake, openDocument, panTo, reset, setZoom, viewport };
export type { FakeCommand };
