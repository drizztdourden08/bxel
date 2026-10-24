/* @layer renderer-app @kind component */
import { Flex } from '@drizztdourden08/tessera';
import { GRID_ROW_ATTRIBUTE } from '../../../sheet-manager/virtual-grid.constants';
import type { GridRowViewProps } from '../SpritesPanel.type';
import { FolderHeader } from './FolderHeader';
import { GridTile } from './GridTile';

const GridRowView = ({ view, row, at }: GridRowViewProps) => (
  <Flex gap="xs" align="start" role="listitem" className="sprites-panel__vrow" {...{ [GRID_ROW_ATTRIBUTE]: at }}>
    {row.group ? <FolderHeader group={row.group} /> : row.facts.map((fact) => <GridTile key={fact.sprite.id} view={view} fact={fact} />)}
  </Flex>
);

export { GridRowView };
