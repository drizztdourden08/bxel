/* @layer renderer-app @kind component */
import { Button, Flex, Tag } from '@drizztdourden08/tessera';
import { chipsOf } from '../behavior/chips-of';
import { CHIPS_SHOWN, PANEL_UI } from '../ProjectPanel.constants';
import type { PanelPartProps } from '../ProjectPanel.type';
import './FilterChips.css';

const FilterChips = ({ model }: PanelPartProps) => {
  const chips = chipsOf(model.query);
  if (chips.length === 0) return null;
  const shown = chips.slice(0, CHIPS_SHOWN);
  const folded = chips.slice(CHIPS_SHOWN);
  return (
    <Flex align="center" gap="xs" className="project-chips" role="group" aria-label="Active filters">
      {shown.map((chip) => (
        <Tag key={chip.id} color="primary" name={`Remove the filter ${chip.label}`} onRemove={chip.remove}>
          {chip.label}
        </Tag>
      ))}
      {folded.length === 0 ? null : (
        <Tag title={folded.map((chip) => chip.label).join(', ')}>{PANEL_UI.moreFilters(folded.length)}</Tag>
      )}
      <Button variant="ghost" size="xs" onClick={model.query.clear}>
        {PANEL_UI.clearFilters}
      </Button>
    </Flex>
  );
};

export { FilterChips };
