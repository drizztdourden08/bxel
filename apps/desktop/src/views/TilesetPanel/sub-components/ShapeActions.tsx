/* @layer renderer-app @kind component */
import { ButtonGroup, Icon, IconButton } from '@drizztdourden08/tessera';
import { flattenFrame, tileShapes } from '@bxel/document';
import { useNoticeStore } from '../../../stores/useNoticeStore';
import { useTilesetViewStore } from '../../../stores/useTilesetViewStore';
import { setShapes } from '../../../tilemap/set-shapes';
import { ActionHint } from '../../ActionHint';
import { addShape } from '../behavior/add-shape';
import { tracePixels } from '../behavior/trace-pixels';
import { SHAPE_ACTIONS, TILESET_TEXT } from '../TilesetPanel.constants';
import type { ShapeEditorProps } from '../TilesetPanel.type';

const ShapeActions = ({ model, tile, sprite }: ShapeEditorProps) => {
  const clipboard = useTilesetViewStore((state) => state.shapeClipboard);
  const setClipboard = useTilesetViewStore((state) => state.setShapeClipboard);
  const { tileWidth: width, tileHeight: height } = model.tileset;
  const run = (id: (typeof SHAPE_ACTIONS)[number]['id']): void => {
    if (id === 'box') addShape(tile, { kind: 'rect', x: 0, y: 0, width: Math.max(1, Math.floor(width / 2)), height: Math.max(1, Math.floor(height / 2)) });
    else if (id === 'full') addShape(tile, { kind: 'full' });
    else if (id === 'shape') addShape(tile, { kind: 'polygon', points: [{ x: 0, y: height }, { x: width, y: height }, { x: width, y: 0 }] });
    else if (id === 'trace') trace();
    else if (id === 'copy') setClipboard(tileShapes(tile));
    else setShapes([tile.key], clipboard, 'set');
  };
  const trace = (): void => {
    const frame = sprite.frames[0];
    const shape = frame ? tracePixels(flattenFrame(sprite, frame.id), width) : null;
    if (shape) addShape(tile, shape);
    else useNoticeStore.getState().post(TILESET_TEXT.nothingToTrace);
  };
  return (
    <ButtonGroup aria-label={TILESET_TEXT.shapeActions}>
      {SHAPE_ACTIONS.map((action) => (
        <ActionHint key={action.id} hint={action.hint}>
          <IconButton
            label={action.hint.name}
            size="sm"
            disabled={(action.id === 'copy' && tileShapes(tile).length === 0) || (action.id === 'paste' && clipboard.length === 0)}
            onClick={() => run(action.id)}
          >
            <Icon name={action.icon} size={16} />
          </IconButton>
        </ActionHint>
      ))}
    </ButtonGroup>
  );
};

export { ShapeActions };
