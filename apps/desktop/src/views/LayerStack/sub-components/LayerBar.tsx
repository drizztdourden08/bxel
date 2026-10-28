/* @layer renderer-app @kind component */
import { Button, ButtonGroup, DropdownMenu, Flex, Icon, IconButton } from '@drizztdourden08/tessera';
import { ActionHint } from '../../ActionHint';
import { barActions } from '../behavior/bar-actions';
import { newGroups } from '../behavior/new-groups';
import { LAYER_BAR_HINTS, LAYER_STACK_TEXT } from '../LayerStack.constants';
import type { LayerBarProps } from '../LayerStack.type';
import './LayerBar.css';

const LayerBar = ({ model }: LayerBarProps) => (
  <Flex align="center" gap="xs" wrap className="layer-bar">
    <ButtonGroup aria-label={LAYER_STACK_TEXT.newLayer} className="layer-bar__new">
      <ActionHint hint={LAYER_BAR_HINTS.add}>
        <Button size="sm" variant="secondary" icon={<Icon name="plus" size={16} />} aria-label={LAYER_STACK_TEXT.newLayer} onClick={model.actions.add}>
          {LAYER_STACK_TEXT.newShort}
        </Button>
      </ActionHint>
      <DropdownMenu
        trigger={{ label: LAYER_STACK_TEXT.more, icon: 'chevron-down', iconOnly: true }}
        variant="secondary"
        size="sm"
        align="start"
        groups={newGroups(model)}
      />
    </ButtonGroup>
    <ButtonGroup aria-label={LAYER_STACK_TEXT.list}>
      {barActions(model).map((action) => (
        <ActionHint key={action.id} hint={action.reason ? { ...action.hint, description: action.reason } : action.hint}>
          <IconButton label={action.hint.name} size="sm" disabled={action.reason !== null} onClick={action.run}>
            <Icon name={action.icon} size={16} />
          </IconButton>
        </ActionHint>
      ))}
    </ButtonGroup>
  </Flex>
);

export { LayerBar };
