/* @layer renderer-app @kind component */
import { ListItemList, ListItemRow, PanelContainer, Text } from '@drizztdourden08/tessera';
import { OVERVIEW_TEXT } from '../../../asset-overview/asset-overview.constants';
import { showLinked } from '../../../asset-overview/show-linked';
import type { OverviewPartProps } from '../AssetOverview.type';

const LinksPanel = ({ model }: OverviewPartProps) => (
  <PanelContainer title={OVERVIEW_TEXT.linksTitle} level={3}>
    {model.links.length === 0 ? (
      <Text tone="muted">{OVERVIEW_TEXT.noLinks}</Text>
    ) : (
      <ListItemList label={OVERVIEW_TEXT.linksTitle}>
        {model.links.map((link) => (
          <ListItemRow
            key={`${link.relation}:${link.key.kind}:${link.key.id}`}
            name={link.name}
            meta={`${link.relation === 'uses' ? OVERVIEW_TEXT.uses : OVERVIEW_TEXT.usedBy}, ${link.kindLabel}`}
            onClick={() => showLinked(model.focus.documentId, link.key)}
          />
        ))}
      </ListItemList>
    )}
  </PanelContainer>
);

export { LinksPanel };
