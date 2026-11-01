/* @layer renderer-app @kind logic */
import { useSubjectStore } from '../../properties-subject/useSubjectStore';
import { findAssetTab } from '../../workspace/find-asset-tab';
import { APP_TOOL_TEXT } from './app-tool.constants';
import { locationPath } from './location-path';
import { reply } from './reply';
import { viewFail } from './view-fail';
import type { ViewStep } from './view-steps.type';

const propertiesStep: ViewStep = (patch, context) => {
  const { properties } = patch;
  if (!properties) return null;
  const subject = useSubjectStore.getState();
  if (properties.back === true) subject.back();
  if (properties.forward === true) subject.forward();
  if (properties.file === null) subject.unpin();
  if (properties.file) {
    const path = locationPath(context, properties.file, 'properties.file');
    if (!path.ok) return reply(path);
    const tab = findAssetTab(path.value);
    if (tab === null) return viewFail(APP_TOOL_TEXT.notOpen, 'properties.file');
    subject.pinTo({ path: path.value, key: tab.key });
  }
  return null;
};

export { propertiesStep };
