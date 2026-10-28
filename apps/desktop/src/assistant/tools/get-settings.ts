/* @layer renderer-app @kind logic */
import { nav } from '@drizztdourden08/brock-react';
import type { ToolHandler } from '../assistant.type';
import { reply } from './reply';
import { settingsPages } from './settings-pages';
import type { GetSettingsInput } from './get-settings.type';
import { settingsTarget } from './settings-target';

const getSettings: ToolHandler = (raw) => {
  const input = raw as GetSettingsInput;
  const failed = settingsTarget(input.scope, input.target);
  if (failed) return failed;
  const pages = settingsPages({ scope: input.scope, page: input.page, keys: input.keys, schema: input.schema });
  const routes = nav.routes().map((route) => ({ route: route.route, title: route.title, kind: route.kind }));
  return reply({ ok: true, scope: input.scope, pages, routes });
};

export { getSettings };
