/* @layer renderer-app @kind component */
import { Box, Tree } from '@drizztdourden08/tessera';
import { useLayerViewStore } from '../../../stores/useLayerViewStore';
import type { LayerNode } from '../behavior/layer-nodes.type';
import { useLayerSweep } from '../behavior/useLayerSweep';
import { useLayerTree } from '../behavior/useLayerTree';
import { LAYER_STACK_TEXT } from '../LayerStack.constants';
import type { LayerListProps } from '../LayerStack.type';
import { LayerLabel } from './LayerLabel';
import { LayerTrail } from './LayerTrail';
import './LayerList.css';

const LayerList = ({ model, rows, filtered, picked, pick, pickKeys, thumbSize }: LayerListProps) => {
  const folded = useLayerViewStore((state) => state.folded);
  const sweep = useLayerSweep(model, picked);
  const movable = model.kind !== 'sheet' && !filtered;
  const tree = useLayerTree({ model, rows, picked, pick, pickKeys, movable });
  return (
    <Box className="layer-list">
      <Tree<LayerNode>
        key={thumbSize}
        {...tree}
        label={model.kind === 'map' ? LAYER_STACK_TEXT.mapList : LAYER_STACK_TEXT.list}
        getKey={(node) => node.row.id}
        getChildren={(node) => (node.row.kind === 'group' ? node.children : undefined)}
        isBranch={(node) => node.row.kind === 'group'}
        getLabel={(node) => node.row.name}
        rowSize={thumbSize === 24 ? 'normal' : 'compact'}
        trail="always"
        className={thumbSize === 40 ? 'layer-list__tree layer-list__tree--large' : 'layer-list__tree'}
        renderLabel={(node) => (
          <LayerLabel
            row={node.row}
            active={node.row.id === model.activeId}
            picked={picked.includes(node.row.id)}
            folded={folded.includes(node.row.id)}
            thumbSize={thumbSize}
            follow={node.row.id === model.activeId && model.kind === 'sprite'}
            onRename={(name) => model.actions.rename(node.row.id, name)}
          />
        )}
        renderTrail={(node) => (
          <LayerTrail
            row={node.row}
            sweep={sweep}
            onAddMissing={node.row.note !== null && model.actions.addMissing ? () => model.actions.addMissing?.(node.row.id) : undefined}
          />
        )}
      />
    </Box>
  );
};

export { LayerList };
