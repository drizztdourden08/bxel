/* @layer renderer-app @kind component */
import { useId } from 'react';
import { Box } from '@drizztdourden08/tessera';
import { useLayerViewStore } from '../../../stores/useLayerViewStore';
import { useLayerList } from '../behavior/useLayerList';
import { useLayerSweep } from '../behavior/useLayerSweep';
import { LAYER_MOVE_KEYS, LAYER_STACK_TEXT } from '../LayerStack.constants';
import type { LayerListProps } from '../LayerStack.type';
import { LayerRow } from './LayerRow';
import './LayerList.css';

const LayerList = ({ model, shown, filtered, picked, pick, thumbSize }: LayerListProps) => {
  const folded = useLayerViewStore((state) => state.folded);
  const toggleFold = useLayerViewStore((state) => state.toggleFold);
  const hintId = useId();
  const sweep = useLayerSweep(model, picked);
  const tree = model.rows.some((row) => row.kind === 'group');
  const movable = model.kind !== 'sheet' && !filtered;
  const { listRef, drag, message, tabId, onKeyDown, onFocus } = useLayerList({ model, shown, movable, pick });
  return (
    <Box className="layer-list">
      <Box
        as="ul"
        ref={listRef}
        className="layer-list__items"
        aria-label={model.kind === 'map' ? LAYER_STACK_TEXT.mapList : LAYER_STACK_TEXT.list}
        aria-describedby={hintId}
        aria-keyshortcuts={LAYER_MOVE_KEYS}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
      >
        {shown.map((row, index) => (
          <LayerRow
            key={row.id}
            row={row}
            index={index}
            total={shown.length}
            active={row.id === model.activeId}
            picked={picked.includes(row.id)}
            tabbable={row.id === tabId}
            movable={movable}
            tree={tree}
            folded={folded.includes(row.id)}
            thumbSize={thumbSize}
            drag={drag}
            sweep={sweep}
            model={model}
            onPick={pick}
            onFold={toggleFold}
          />
        ))}
      </Box>
      <Box id={hintId} className="visually-hidden">{LAYER_STACK_TEXT.moveHint}</Box>
      <Box className="visually-hidden" aria-live="polite">{message}</Box>
    </Box>
  );
};

export { LayerList };
