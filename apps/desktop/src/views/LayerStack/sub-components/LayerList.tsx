/* @layer renderer-app @kind component */
import { useId } from 'react';
import { Box } from '@drizztdourden08/tessera';
import { useLayerList } from '../behavior/useLayerList';
import { useLayerSweep } from '../behavior/useLayerSweep';
import { LAYER_MOVE_KEYS, LAYER_STACK_TEXT } from '../LayerStack.constants';
import type { LayerListProps } from '../LayerStack.type';
import { LayerRow } from './LayerRow';
import './LayerList.css';

/** The rows of the layers, top layer first, with one Tab stop, the arrow keys and drag to reorder. */
const LayerList = ({ model, shown, filtered, picked, pick, thumbSize }: LayerListProps) => {
  const hintId = useId();
  const sweep = useLayerSweep(model, picked);
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
            thumbSize={thumbSize}
            drag={drag}
            sweep={sweep}
            model={model}
            onPick={pick}
          />
        ))}
      </Box>
      <Box id={hintId} className="visually-hidden">{LAYER_STACK_TEXT.moveHint}</Box>
      <Box className="visually-hidden" aria-live="polite">{message}</Box>
    </Box>
  );
};

export { LayerList };
