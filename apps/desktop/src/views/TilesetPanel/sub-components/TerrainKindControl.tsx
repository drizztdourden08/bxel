/* @layer renderer-app @kind component */
import { SegmentedControl } from '@drizztdourden08/tessera';
import { emptyRules } from '../../../tilemap/terrain/empty-rules';
import { TERRAIN_CHOICES, TERRAIN_TEXT } from '../../../tilemap/terrain/terrain.constants';
import { terrainChoice } from '../../../tilemap/terrain/terrain-choice';
import { setTerrain } from '../../../tilemap/set-terrain';
import type { TilesetHeaderProps } from '../TilesetPanel.type';

const TerrainKindControl = ({ model }: TilesetHeaderProps) => (
  <SegmentedControl
    size="sm"
    aria-label={TERRAIN_TEXT.kind}
    value={terrainChoice(model.tileset.terrain)}
    options={[...TERRAIN_CHOICES]}
    onChange={(choice) => setTerrain(choice === 'none' ? null : emptyRules(choice))}
  />
);

export { TerrainKindControl };
