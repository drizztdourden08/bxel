/* @layer renderer-app @kind constants */
import { always, any, hasDocument } from '../predicates.constants';
import { rule } from '../rule';
import type { UiRule } from '../ui-rule.type';
import { EDIT_STAGE, MAP, PIXEL, SHEET } from './groups.constants';

const STATUS_RULES: Record<string, UiRule> = {
  'status.cursor': rule({ applies: any(EDIT_STAGE, SHEET) }),
  'status.zoom': rule({ applies: any(EDIT_STAGE, SHEET) }),
  'status.colour-1': rule({ applies: PIXEL }),
  'status.colour-2': rule({ applies: PIXEL }),
  'status.tile': rule({ applies: MAP }),
  'status.saved': rule({ applies: hasDocument }),
  'status.recovered': rule({ applies: always }),
  'status.help': rule({ applies: always }),
};

export { STATUS_RULES };
