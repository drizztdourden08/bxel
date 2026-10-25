/* @layer renderer-app @kind logic */
import type { Section } from '@drizztdourden08/brock-react';
import type { RowText } from './config-source.type';
import { SETTINGS_PAGES } from './settings-pages.constants';

const itemsOf = (section: Section) => [...(section.items ?? []), ...(section.subsections ?? []).flatMap((sub) => sub.items)];

const rowTextOf = (key: string): RowText | null => {
  for (const sections of SETTINGS_PAGES) {
    const item = sections.flatMap(itemsOf).find((each) => each.key === key);
    if (item) return { label: item.label, description: item.description, hint: item.hint };
  }
  return null;
};

export { rowTextOf };
