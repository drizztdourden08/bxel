/* @layer renderer-app @kind logic */
import { TEMPLATE_EDGES, TEMPLATE_REPEATED, TEMPLATE_TOKEN } from './fill-template.constants';
import { safeName } from './safe-name';

const fillTemplate = (template: string, values: Readonly<Record<string, string>>): string =>
  safeName(
    template
      .replace(TEMPLATE_TOKEN, (_token, name: string) => values[name] ?? '')
      .replace(TEMPLATE_REPEATED, '$1')
      .replace(TEMPLATE_EDGES, ''),
  );

export { fillTemplate };
