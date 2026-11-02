/* @layer renderer-app @kind component */
import { useGuideDialogStore } from '../../stores/useGuideDialogStore';
import { GuideDialogContent } from './sub-components/GuideDialogContent';

const GuideDialog = () => {
  const open = useGuideDialogStore((state) => state.open);
  return open ? <GuideDialogContent /> : null;
};

export { GuideDialog };
