/* @layer renderer-app @kind component */
import { Button, DropdownMenu, Flex, Icon, SplitButton, Text } from '@drizztdourden08/tessera';
import { SHEET_TEXT } from '../../../sheet-manager/sheet-text.constants';
import { useManagerStore } from '../../../stores/useManagerStore';
import { overflowGroups } from '../behavior/overflow-groups';
import { addItems } from '../behavior/add-groups';
import type { ManagerModelProps } from '../SpritesPanel.type';

const SheetTitle = ({ model }: ManagerModelProps) => {
  const store = useManagerStore();
  const total = model.facts.length + model.animationFacts.length;
  const shown = model.shown.length + model.animations.length;
  const picked = model.ids.length + model.picked.length;
  const layout = model.sheet?.layout;
  return (
    <Flex align="center" justify="between" gap="sm" className="sprites-panel__title">
      <Flex gap="xs" align="center" wrap className="sprites-panel__heading">
        <Text variant="label" className="sprites-panel__sheet-name" title={model.sheet?.name}>
          {model.sheet?.name ?? SHEET_TEXT.titleLabel}
        </Text>
        {layout && (
          <Button size="xs" variant="tertiary" icon={<Icon name="pixel-grid-view" size={12} />} aria-label={SHEET_TEXT.layoutOpen} onClick={() => store.patch({ layoutOpen: true })}>
            {SHEET_TEXT.layout(layout)}
          </Button>
        )}
        <Text variant="caption" tone="dim" aria-live="polite">
          {`${SHEET_TEXT.shownOf(shown, total)}${SHEET_TEXT.picked(picked)}`}
        </Text>
      </Flex>
      <Flex gap="xs" align="center">
        <SplitButton
          size="sm"
          variant="primary"
          label={SHEET_TEXT.add}
          menuLabel={SHEET_TEXT.addMenu}
          icon={<Icon name="plus" size={16} />}
          items={addItems(model, store.patch)}
          onClick={() => store.patch({ libraryRequest: Date.now() })}
        />
        <DropdownMenu size="sm" label={SHEET_TEXT.overflow} trigger={{ label: SHEET_TEXT.overflow, icon: 'ellipsis', iconOnly: true }} groups={overflowGroups(store)} />
      </Flex>
    </Flex>
  );
};

export { SheetTitle };
