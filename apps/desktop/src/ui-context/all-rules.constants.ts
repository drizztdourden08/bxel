/* @layer renderer-app @kind constants */
import { COMMAND_RULES } from './rules/command-rules.constants';
import { MENU_RULES } from './rules/menu-rules.constants';
import { STATUS_RULES } from './rules/status-rules.constants';
import { TOOLBAR_RULES } from './rules/toolbar-rules.constants';
import { WIDGET_RULES } from './rules/widget-rules.constants';
import type { UiRule } from './ui-rule.type';

const ALL_RULES: Readonly<Record<string, UiRule>> = Object.freeze({
  ...COMMAND_RULES,
  ...WIDGET_RULES,
  ...TOOLBAR_RULES,
  ...MENU_RULES,
  ...STATUS_RULES,
});

export { ALL_RULES };
