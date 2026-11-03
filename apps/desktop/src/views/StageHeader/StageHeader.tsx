/* @layer renderer-app @kind component */
import { Breadcrumbs, Button, Flex } from '@drizztdourden08/tessera';
import { crumbSegments } from '../../stage-header/crumb-segments';
import { HEADER_TEXT } from '../../stage-header/stage-header.constants';
import { useStageHeader } from './behavior/useStageHeader';
import { ChipItem } from './sub-components/ChipItem';
import './StageHeader.css';

const StageHeader = () => {
  const model = useStageHeader();
  if (!model) return null;
  const navigate = (id: string): void => model.crumbs.find((crumb) => crumb.id === id)?.run?.();
  const chips = model.chips.length > 0 ? model.chips.map((chip) => <ChipItem key={chip.id} chip={chip} />) : undefined;
  return (
    <Flex wrap gap="sm" align="center" className="stage-header">
      <Breadcrumbs
        segments={crumbSegments(model.crumbs)}
        onNavigate={navigate}
        label={HEADER_TEXT.region}
        trailing={chips}
        trailingLabel={HEADER_TEXT.chips}
        className="stage-header__trail"
      />
      {model.actions.length > 0 && (
        <Flex gap="xs" align="center" className="stage-header__actions">
          {model.actions.map((action) => (
            <Button
              key={action.label}
              size="xs"
              variant="secondary"
              title={action.title}
              aria-pressed={action.pressed}
              disabled={action.disabled}
              onClick={action.run}
            >
              {action.label}
            </Button>
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export { StageHeader };
