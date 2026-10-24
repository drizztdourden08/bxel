/* @layer renderer-app @kind component */
import { Canvas } from '@drizztdourden08/tessera';
import { COLLISION_TEXT } from '../../../tilemap/collision/collision.constants';
import { useCollisionCanvas } from '../behavior/useCollisionCanvas';
import type { CollisionProps } from '../TilesetPanel.type';

const CollisionCanvas = (props: CollisionProps) => {
  const handle = useCollisionCanvas(props);
  return (
    <Canvas
      ref={handle.canvas}
      className="tileset-panel__collision"
      role="img"
      aria-label={COLLISION_TEXT.canvas}
      onPointerDown={handle.pointerDown}
      onPointerMove={handle.pointerMove}
      onPointerUp={handle.pointerUp}
      onPointerCancel={handle.pointerUp}
      onDoubleClick={handle.doubleClick}
    />
  );
};

export { CollisionCanvas };
