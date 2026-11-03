/* @layer renderer-app @kind logic */
import type { BreadcrumbSegment } from '@drizztdourden08/tessera';
import type { BrowserModel } from '../../../project-browser/browser-model.type';
import { crumbId } from './crumb-id';
import { folderSiblings } from './folder-siblings';

const browserSegments = (model: BrowserModel): readonly BreadcrumbSegment[] =>
  model.crumbs.map((crumb) => {
    const siblings = folderSiblings(model, crumb.path);
    return { id: crumbId(crumb.path), label: crumb.label, siblings: siblings.length > 0 ? siblings : undefined };
  });

export { browserSegments };
