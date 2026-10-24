/* @layer renderer-app @kind component */
import { VIRTUAL_GRID_MIN } from '../SpritesPanel.constants';
import type { SpriteGridProps } from '../SpritesPanel.type';
import { FlowGrid } from './FlowGrid';
import { VirtualGrid } from './VirtualGrid';

const SpriteGrid = (props: SpriteGridProps) =>
  props.model.shown.length >= VIRTUAL_GRID_MIN ? <VirtualGrid {...props} /> : <FlowGrid {...props} />;

export { SpriteGrid };
