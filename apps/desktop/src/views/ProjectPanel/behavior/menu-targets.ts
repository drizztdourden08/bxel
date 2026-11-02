/* @layer renderer-app @kind logic */
import type { BrowserItem } from '../../../panel-browser/project-browser.type';
import type { ProjectPanelModel } from '../ProjectPanel.type';

const menuTargets = (model: ProjectPanelModel, keys: ReadonlySet<string> | undefined): readonly BrowserItem[] =>
  keys === undefined ? [] : [...keys].flatMap((key) => model.browser.itemOf(key) ?? []);

export { menuTargets };
