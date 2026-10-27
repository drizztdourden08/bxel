/* @layer renderer-app @kind logic */
import { dialogs, nav } from '@drizztdourden08/brock-react';
import { currentTarget } from '../../editor/current-target';
import { useDocumentStore } from '../../stores/useDocumentStore';
import { useManagerStore } from '../../stores/useManagerStore';
import { useSelectionStore } from '../../stores/useSelectionStore';
import { useSpriteStore } from '../../stores/useSpriteStore';
import { useTilemapStore } from '../../stores/useTilemapStore';
import { useTimelineStore } from '../../stores/useTimelineStore';
import { useToolStore } from '../../stores/useToolStore';
import { useViewStore } from '../../stores/useViewStore';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import { activeAssetOf } from '../../workspace/active-asset-of';
import { assetName } from '../../workspace/asset-name';
import { keyId } from '../../workspace/key-id';
import { selectionReply } from './selection-runs';

type Sees = (documentId: string) => boolean;

const tabsOf = (sees: Sees) => {
  const { tabs, activeTab, workspaces } = useWorkspaceStore.getState();
  const { host } = useDocumentStore.getState();
  return tabs.filter((tab) => sees(tab.documentId)).map((tab) => {
    const view = host.view(tab.documentId);
    const asset = view ? assetName(view.state.artwork, tab.key) : null;
    const info = view ? activeAssetOf(view, workspaces[tab.documentId], tab) : null;
    return {
      tabId: tab.id,
      documentId: tab.documentId,
      name: info?.name ?? asset ?? tab.id,
      asset: keyId(tab.key),
      dirty: info?.dirty ?? false,
      active: tab.id === activeTab,
    };
  });
};

const activeOf = (sees: Sees) => {
  const { activeId, host } = useDocumentStore.getState();
  const view = activeId === null || !sees(activeId) ? null : host.view(activeId);
  if (!view) return null;
  const sprites = useSpriteStore.getState();
  const tiles = useTilemapStore.getState();
  const timeline = useTimelineStore.getState();
  const target = currentTarget();
  return {
    documentId: view.state.documentId,
    revision: view.state.revision,
    dirty: !view.clean,
    mode: sprites.mode,
    sprite: target?.sprite.id ?? null,
    frame: target?.frameId ?? null,
    animationFrame: timeline.frameId,
    layer: target?.layerId ?? null,
    mapLayer: tiles.layerId,
    tilemap: tiles.mapId,
    tileset: tiles.tilesetId,
    tileMode: tiles.editMode,
  };
};

const toolOf = () => {
  const tool = useToolStore.getState();
  return {
    id: tool.tool,
    brushSize: tool.brushSize,
    brushShape: tool.brushShape,
    pixelPerfect: tool.pixelPerfect,
    fillMode: tool.fillMode,
    connectivity: tool.connectivity,
    shape: tool.shape,
    filled: tool.filled,
  };
};

const zoomOf = () => {
  const { viewport } = useViewStore.getState();
  if (!viewport) return null;
  const view = viewport.view();
  const halfWidth = view.width / 2 / view.zoom;
  const halfHeight = view.height / 2 / view.zoom;
  const x = Math.max(0, Math.floor(view.pan.x - halfWidth));
  const y = Math.max(0, Math.floor(view.pan.y - halfHeight));
  const right = Math.min(view.imageWidth, Math.ceil(view.pan.x + halfWidth));
  const bottom = Math.min(view.imageHeight, Math.ceil(view.pan.y + halfHeight));
  return {
    percent: Math.round(view.zoom * 100),
    centre: { x: view.pan.x, y: view.pan.y },
    visible: { x, y, width: Math.max(0, right - x), height: Math.max(0, bottom - y) },
    image: { width: view.imageWidth, height: view.imageHeight },
  };
};

const selectionOf = (sees: Sees) => {
  const { mask, owner, variant, mode } = useSelectionStore.getState();
  const { activeId } = useDocumentStore.getState();
  const shown = mask !== null && owner === activeId && activeId !== null && sees(activeId) ? mask : null;
  return shown === null ? null : { ...selectionReply(shown), variant, combine: mode };
};

const clipboardOf = () => {
  const { clipboard } = useSelectionStore.getState();
  return clipboard === null ? null : { width: clipboard.width, height: clipboard.height, origin: clipboard.origin };
};

const playbackOf = () => {
  const timeline = useTimelineStore.getState();
  return {
    playing: timeline.playing,
    loop: timeline.loop,
    frame: timeline.frameId,
    tag: timeline.tagId,
    selectedFrames: timeline.selection.frames,
    onionSkin: timeline.onion.on,
  };
};

const togglesOf = () => {
  const view = useViewStore.getState();
  return { grid: view.grid, gridMajor: view.gridMajor, gridTile: view.gridTile, guides: view.guides, rulers: view.rulers, tiled: view.tiled };
};

const spritesOf = () => {
  const manager = useManagerStore.getState();
  const sprites = useSpriteStore.getState();
  return { selected: sprites.selected, scope: sprites.spritesScope, query: manager.query, filter: manager.filter, sheetId: manager.sheetId };
};

const viewSnapshot = (sees: Sees = () => true) => {
  const tool = useToolStore.getState();
  return {
    page: nav.active(),
    dialog: dialogs.current(),
    tabs: tabsOf(sees),
    active: activeOf(sees),
    tool: toolOf(),
    colours: { foreground: tool.foreground, background: tool.background, third: tool.third, fourth: tool.fourth },
    symmetry: { x: tool.symmetryX, y: tool.symmetryY, axisX: tool.axisX, axisY: tool.axisY },
    zoom: zoomOf(),
    toggles: togglesOf(),
    playback: playbackOf(),
    selection: selectionOf(sees),
    clipboard: clipboardOf(),
    sprites: spritesOf(),
  };
};

export { viewSnapshot };
