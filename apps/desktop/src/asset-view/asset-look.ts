/* @layer renderer-app @kind logic */
import type { Size } from '@bxel/document';
import type { CanvasLook } from '../canvas-look/canvas-look.type';
import type { AssetView } from './asset-view.type';

const withBackground = (look: CanvasLook, view: AssetView): CanvasLook =>
  view.background === 'solid' ? { ...look, checkerA: view.backgroundColour, checkerB: view.backgroundColour } : look;

const withMajor = (look: CanvasLook, view: AssetView): CanvasLook =>
  view.majorEvery === null ? look : { ...look, majorLine: { ...look.majorLine, every: view.majorEvery } };

const withTile = (look: CanvasLook, tile: Size | null): CanvasLook =>
  tile === null ? look : { ...look, tileLine: { ...look.tileLine, every: tile.width, everyY: tile.height } };

const assetLook = (look: CanvasLook, view: AssetView, tile: Size | null): CanvasLook =>
  withTile(withMajor(withBackground(look, view), view), view.tileGrid ?? tile);

export { assetLook };
