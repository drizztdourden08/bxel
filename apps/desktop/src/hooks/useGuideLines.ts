/* @layer renderer-app @kind hook */
import { guideScope } from '../guides/guide-scope';
import type { GuideLines } from '../guides/guide.type';
import { useActiveDocument } from './useActiveDocument';
import { useEditorTarget } from './useEditorTarget';

const useGuideLines = (): GuideLines | undefined => {
  useActiveDocument();
  useEditorTarget();
  return guideScope()?.lines();
};

export { useGuideLines };
