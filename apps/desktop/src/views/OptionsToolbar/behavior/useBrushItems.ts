/* @layer renderer-app @kind hook */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { COMMAND_ID } from '../../../keymap/keymap.constants';
import { BRUSH_SIZE } from '../../../stores/tool-store.constants';
import { useToolStore } from '../../../stores/useToolStore';
import { choose, hintChoice, hintFace } from '../../../toolbar-items';
import { useCommandKeys } from '../../ActionHint';
import { BRUSH_SHAPE_HINTS, BRUSH_SHAPE_ICONS, BRUSH_SHAPES, BRUSH_SIZE_HINT, OPTIONS_TEXT } from '../OptionsToolbar.constants';
import { sizeShortcuts } from './size-shortcuts';

const useBrushItems = (): ToolbarItem[] => {
  const size = useToolStore((state) => state.brushSize);
  const shape = useToolStore((state) => state.brushShape);
  const setSize = useToolStore((state) => state.setBrushSize);
  const setShape = useToolStore((state) => state.setBrushShape);
  const smaller = useCommandKeys(COMMAND_ID.brushSmaller)[0];
  const larger = useCommandKeys(COMMAND_ID.brushLarger)[0];
  return [
    {
      kind: 'number',
      id: 'brush-size',
      ...hintFace(BRUSH_SIZE_HINT),
      shortcut: sizeShortcuts(smaller, larger),
      min: BRUSH_SIZE.min,
      max: BRUSH_SIZE.max,
      step: 1,
      value: size,
      onChange: setSize,
    },
    {
      kind: 'group',
      id: 'brush-shape',
      label: OPTIONS_TEXT.brushShape,
      value: shape,
      choices: BRUSH_SHAPES.map((each) => hintChoice(each, BRUSH_SHAPE_ICONS[each], BRUSH_SHAPE_HINTS[each])),
      onChange: choose(BRUSH_SHAPES, setShape),
    },
  ];
};

export { useBrushItems };
