/* @layer renderer-app @kind component */
import { useId } from 'react';
import { Box } from '@drizztdourden08/tessera';
import { LAYER_LIST_TEXT, LAYER_MOVE_KEYS, LAYERS_PANEL_TEXT } from '../LayersPanel.constants';
import type { LayerListProps } from '../LayersPanel.type';
import { useLayerList } from '../behavior/useLayerList';
import { LayerRow } from './LayerRow';
import './LayerList.css';

const LayerList = (props: LayerListProps) => {
  const { items, selectedId, onSelect, onToggle } = props;
  const hintId = useId();
  const { listRef, drag, message, tabId, onKeyDown, onFocus } = useLayerList(props);
  return (
    <Box className="layer-list">
      <Box
        as="ul"
        ref={listRef}
        className="layer-list__items"
        aria-label={LAYERS_PANEL_TEXT.list}
        aria-describedby={hintId}
        aria-keyshortcuts={LAYER_MOVE_KEYS}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
      >
        {items.map((item, index) => (
          <LayerRow
            key={item.id}
            item={item}
            index={index}
            total={items.length}
            selected={item.id === selectedId}
            tabbable={item.id === tabId}
            drag={drag}
            onSelect={onSelect}
            onToggle={onToggle}
          />
        ))}
      </Box>
      <Box id={hintId} className="visually-hidden">{LAYER_LIST_TEXT.moveHint}</Box>
      <Box className="visually-hidden" aria-live="polite">{message}</Box>
    </Box>
  );
};

export { LayerList };
