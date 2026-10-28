/* @layer renderer-app @kind test */
import { fake } from './app-tools-fake';
import type { FakeItem } from './app-tools-fake';

const controlOf = (item: FakeItem) => ({
  kind: item.kind ?? 'toggle',
  ...(item.min === undefined ? {} : { min: item.min }),
  ...(item.max === undefined ? {} : { max: item.max }),
  ...(item.choices === undefined ? {} : { choices: item.choices.map((value) => ({ value, label: value, disabled: false })) }),
});

const itemOf = (item: FakeItem) => ({
  key: item.key,
  label: item.label,
  control: controlOf(item),
  source: item.source ?? 'app',
  settable: item.settable ?? true,
  visible: item.visible ?? true,
  ...(item.value === undefined ? {} : { value: item.value }),
});

const catalogMock = () =>
  fake.screens.map((screen) => ({
    id: screen.id,
    label: screen.label,
    group: screen.group,
    route: screen.route,
    sections: [{ id: 'main', title: 'Main', subsections: [], items: screen.items.map(itemOf) }],
  }));

export { catalogMock };
