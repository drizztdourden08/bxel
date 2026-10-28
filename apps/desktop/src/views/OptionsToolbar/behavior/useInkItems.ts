/* @layer renderer-app @kind hook */
import type { DitherPattern } from '@bxel/raster';
import { DITHER_PATTERNS } from '@bxel/raster';
import type { MenuGroup, ToolbarItem } from '@drizztdourden08/tessera';
import { INK_KINDS } from '../../../stores/drawing-store.constants';
import { useDrawingStore } from '../../../stores/useDrawingStore';
import { buttonItem, hintFace } from '../../../toolbar-items';
import { DITHER_PATTERN_LABELS, DRAWING_TEXT, HINTS, INK_DESCRIPTIONS, INK_ICONS, INK_LABELS } from '../DrawingOptions.constants';

const useInkItems = (): ToolbarItem[] => {
  const kind = useDrawingStore((state) => state.inkKind);
  const pattern = useDrawingStore((state) => state.ditherPattern);
  const level = useDrawingStore((state) => state.ditherLevel);
  const steps = useDrawingStore((state) => state.shadeSteps);
  const patch = useDrawingStore((state) => state.patch);
  const inks: MenuGroup = {
    id: 'ink',
    label: DRAWING_TEXT.ink,
    items: INK_KINDS.map((each) => ({
      id: each,
      label: INK_LABELS[each],
      description: INK_DESCRIPTIONS[each],
      icon: INK_ICONS[each],
      kind: 'radio' as const,
      checked: kind === each,
      onSelect: () => patch({ inkKind: each }),
    })),
  };
  const patterns: MenuGroup = {
    id: 'pattern',
    label: DRAWING_TEXT.inkPattern,
    items: DITHER_PATTERNS.map((each: DitherPattern) => ({
      id: each,
      label: DITHER_PATTERN_LABELS[each],
      kind: 'radio' as const,
      checked: pattern === each,
      onSelect: () => patch({ ditherPattern: each }),
    })),
  };
  const items: ToolbarItem[] = [
    buttonItem({
      id: 'ink',
      icon: INK_ICONS[kind],
      hint: { name: `${DRAWING_TEXT.ink}: ${INK_LABELS[kind]}`, description: INK_DESCRIPTIONS[kind] },
      caption: INK_LABELS[kind],
      options: kind === 'dither' ? [inks, patterns] : [inks],
      openOn: 'click',
      onSelect: () => patch({ inkKind: kind }),
    }),
  ];
  if (kind === 'dither') {
    items.push({ kind: 'number', id: 'ink-level', ...hintFace(HINTS.inkLevel), min: 1, max: 15, step: 1, value: level, onChange: (value) => patch({ ditherLevel: Math.min(15, Math.max(1, Math.trunc(value))) }) });
  }
  if (kind === 'shade' || kind === 'lighten' || kind === 'darken') {
    items.push({ kind: 'number', id: 'ink-steps', ...hintFace(HINTS.inkSteps), min: 1, max: 4, step: 1, value: steps, onChange: (value) => patch({ shadeSteps: Math.min(4, Math.max(1, Math.trunc(value))) }) });
  }
  return items;
};

export { useInkItems };
