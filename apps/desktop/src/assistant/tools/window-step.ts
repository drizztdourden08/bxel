/* @layer renderer-app @kind logic */
import { nav } from '@drizztdourden08/brock-react';
import { useBrowserStore } from '../../project-browser/useBrowserStore';
import { useSubjectStore } from '../../properties-subject/useSubjectStore';
import { findAssetTab } from '../../workspace/find-asset-tab';
import type { ToolContext } from '../assistant.type';
import type { WindowTarget } from './window-step.type';
import { APP_TOOL_TEXT } from './app-tool.constants';
import { locationPath } from './location-path';
import { locationPaths } from './location-paths';
import { reply } from './reply';
import { viewFail } from './view-fail';
import type { ViewStep } from './view-steps.type';
import { WINDOW_ROUTES } from './window-step.constants';

const pinSubject = (path: string, pin: boolean | undefined): ReturnType<ViewStep> => {
  const tab = findAssetTab(path);
  if (tab === null) return viewFail(APP_TOOL_TEXT.notOpen, 'window.subject');
  const subject = useSubjectStore.getState();
  if (pin === false) subject.unpin();
  else subject.pinTo({ path, key: tab.key });
  return null;
};

const subjectStep = (context: ToolContext, target: WindowTarget): ReturnType<ViewStep> => {
  if (target.subject === undefined) {
    if (target.pin === false) useSubjectStore.getState().unpin();
    return null;
  }
  const path = locationPath(context, target.subject, 'window.subject');
  return path.ok ? pinSubject(path.value, target.pin) : reply(path);
};

const selectStep = (context: ToolContext, target: WindowTarget): ReturnType<ViewStep> => {
  if (target.select === undefined) return null;
  const picked = locationPaths(context, target.select, 'window.select');
  if (!picked.ok) return reply(picked);
  useBrowserStore.getState().select({ ids: picked.value, anchor: picked.value[0] ?? null });
  return null;
};

const windowStep: ViewStep = (patch, context) => {
  const { window: target } = patch;
  if (!target) return null;
  const route = target.page === undefined ? WINDOW_ROUTES[target.open] : `${target.open}/${target.page}`;
  if (target.page !== undefined && !nav.routes().some((each) => each.route === route)) return viewFail(APP_TOOL_TEXT.badRoute(route), 'window.page');
  const failed = subjectStep(context, target) ?? selectStep(context, target);
  if (failed) return failed;
  nav.open(route);
  return null;
};

export { windowStep };
