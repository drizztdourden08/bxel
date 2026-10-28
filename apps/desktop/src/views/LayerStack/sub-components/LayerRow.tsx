/* @layer renderer-app @kind component */
import { useEffect, useRef } from 'react';
import { Box } from '@drizztdourden08/tessera';
import { useLayerViewStore } from '../../../stores/useLayerViewStore';
import { layerTagStyle } from '../behavior/layer-tag-style';
import type { LayerRowProps } from '../LayerStack.type';
import { LayerGrip } from './LayerGrip';
import { LayerMain } from './LayerMain';
import { LayerName } from './LayerName';
import { LayerToggle } from './LayerToggle';
import './LayerRow.css';

const LayerRow = (props: LayerRowProps) => {
  const { row, index, total, active, picked, tabbable, movable, thumbSize, drag, sweep, model, onPick } = props;
  const renaming = useLayerViewStore((state) => state.renamingId === row.id);
  const rowRef = useRef<HTMLLIElement>(null);
  const was = useRef(false);
  useEffect(() => {
    if (was.current && !renaming) rowRef.current?.querySelector<HTMLElement>('.layer-row__main')?.focus();
    was.current = renaming;
  }, [renaming]);
  const done = (): void => useLayerViewStore.getState().setRenaming(null);
  return (
    <Box
      as="li"
      ref={rowRef}
      className="layer-row"
      style={layerTagStyle(row.colour)}
      data-reorder-index={index}
      data-reorder-key={row.id}
      data-layer-id={row.id}
      data-active={active ? 'yes' : undefined}
      data-picked={picked ? 'yes' : undefined}
      data-hidden={row.visible || row.mixedVisible ? undefined : 'yes'}
      data-tagged={row.colour ? 'yes' : undefined}
      data-drop={drag.dropMark(index, total)}
      data-dragging={drag.dragging === index ? 'yes' : undefined}
    >
      <LayerGrip index={index} drag={drag} disabled={!movable} />
      <Box role="group" aria-label={row.name} className="layer-row__toggles" data-reorder-toggles>
        <LayerToggle row={row} flag="visible" sweep={sweep} />
        <LayerToggle row={row} flag="locked" sweep={sweep} />
      </Box>
      {renaming ? (
        <LayerName name={row.name} onRename={(name) => model.actions.rename(row.id, name)} onDone={done} />
      ) : (
        <LayerMain
          row={row}
          active={active}
          picked={picked}
          tabbable={tabbable}
          thumbSize={thumbSize}
          follow={active && model.kind === 'sprite'}
          onPick={(how) => onPick(row.id, how)}
          onRename={() => useLayerViewStore.getState().setRenaming(row.id)}
        />
      )}
    </Box>
  );
};

export { LayerRow };
