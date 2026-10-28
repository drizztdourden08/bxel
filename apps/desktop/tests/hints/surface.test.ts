/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { canvasGroups } from '../../src/views/CanvasToolbar/behavior/canvas-groups';
import { railItems } from '../../src/views/ToolRail/behavior/rail-items';
import { CATALOGUE_TEXT } from '../../src/editor/tool-catalogue/tool-catalogue.constants';
import { slotsOf } from '../../src/editor/tool-catalogue/slots-of';
import { railContext } from './rail-context';
import { hasPart } from '../../src/surface/has-part';
import { surfaceOf } from '../../src/surface/surface-of';

const labelsOn = (surface: Parameters<typeof slotsOf>[0]): string[] =>
  railItems(slotsOf(surface), railContext(surface)).flatMap((item) => (item.kind === 'toggle' ? [item.label] : []));

describe('the surface of the open asset', () => {
  it('is none without a file, the sheet in sheet mode and a sprite in sprite mode', () => {
    expect(surfaceOf(false, 'sprite', 'place')).toBe('none');
    expect(surfaceOf(true, 'sheet', 'place')).toBe('sheet');
    expect(surfaceOf(true, 'sprite', 'edit')).toBe('sprite');
  });

  it('is the map when tiles are placed and the tile when its pixels are edited', () => {
    expect(surfaceOf(true, 'tilemap', 'place')).toBe('map');
    expect(surfaceOf(true, 'tilemap', 'edit')).toBe('tile');
  });
});

describe('what each surface can use', () => {
  it('gives a sheet the zoom and nothing that draws', () => {
    expect(hasPart('sheet', 'zoom')).toBe(true);
    for (const part of ['symmetry', 'view', 'tiled', 'playback', 'transform', 'options', 'paint', 'layers'] as const) expect(hasPart('sheet', part)).toBe(false);
  });

  it('gives a map its grids and layers but no pixel aids', () => {
    expect(hasPart('map', 'view')).toBe(true);
    expect(hasPart('map', 'layers')).toBe(true);
    for (const part of ['symmetry', 'tiled', 'playback', 'transform', 'paint'] as const) expect(hasPart('map', part)).toBe(false);
  });

  it('gives a sprite and a tile every drawing aid', () => {
    for (const surface of ['sprite', 'tile'] as const) {
      for (const part of ['symmetry', 'view', 'tiled', 'playback', 'zoom', 'transform', 'options', 'paint', 'layers'] as const) expect(hasPart(surface, part)).toBe(true);
    }
  });
});

describe('the tool rail', () => {
  it('lists the drawing tools on a sprite and only zoom and hand on a sheet', () => {
    expect(labelsOn('sprite')).toHaveLength(slotsOf('sprite').length);
    expect(labelsOn('sheet')).toEqual(['Zoom', 'Hand']);
  });

  it('hides the tools that cannot apply instead of greying them and keeps the view group last', () => {
    expect(labelsOn('map')).not.toContain('Move');
    expect(labelsOn('map').slice(-2)).toEqual(['Zoom', 'Hand']);
    expect(labelsOn('sprite').slice(-2)).toEqual(['Zoom', 'Hand']);
  });

  it('shows the same tools disabled, with the reason, when no document is open', () => {
    const items = railItems(slotsOf('none'), railContext('none', true)).filter((item) => item.kind === 'toggle');
    expect(items.length).toBeGreaterThan(5);
    for (const item of items) {
      expect(item.disabled).toBe(true);
      expect(item.description).toBe(CATALOGUE_TEXT.disabled);
    }
  });
});

describe('the canvas toolbar groups', () => {
  const items = [{ kind: 'separator' as const, id: 'x' }];

  it('drops the groups a surface cannot use and the separators around them', () => {
    const groups = [
      { id: 'scope', part: null, items: [] },
      { id: 'symmetry', part: 'symmetry' as const, items },
      { id: 'zoom', part: 'zoom' as const, items: [{ kind: 'separator' as const, id: 'z' }] },
    ];
    expect(canvasGroups('sheet', groups).map((item) => item.id)).toEqual(['z']);
    expect(canvasGroups('sprite', groups).map((item) => item.id)).toEqual(['x', 'before-zoom', 'z']);
  });
});
