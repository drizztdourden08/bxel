/* @layer renderer-app @kind component */
import { Canvas } from '@drizztdourden08/tessera';
import { useShapeEditor } from '../behavior/useShapeEditor';
import { TILESET_TEXT } from '../TilesetPanel.constants';
import type { ShapeEditorProps } from '../TilesetPanel.type';

const ShapeCanvas = (props: ShapeEditorProps) => {
  const editor = useShapeEditor(props);
  return (
    <Canvas
      ref={editor.canvas}
      className="tileset-panel__shape-canvas"
      role="application"
      tabIndex={0}
      data-shape-canvas=""
      aria-label={TILESET_TEXT.shapeCanvas}
      onPointerDown={editor.pointerDown}
      onPointerMove={editor.pointerMove}
      onPointerUp={editor.pointerUp}
      onKeyDown={editor.keyDown}
      onDoubleClick={editor.doubleClick}
    />
  );
};

export { ShapeCanvas };
