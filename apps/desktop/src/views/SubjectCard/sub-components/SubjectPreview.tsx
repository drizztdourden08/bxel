/* @layer renderer-app @kind component */
import { AssetPreview } from '../../AssetPreview';
import { useSubjectPreview } from '../behavior/useSubjectPreview';
import type { SubjectPartProps } from '../SubjectCard.type';

const SubjectPreview = ({ subject }: SubjectPartProps) => {
  const { preview, loop } = useSubjectPreview(subject);
  return <AssetPreview key={`${subject.focus.key.kind}:${subject.focus.key.id}`} preview={preview} name={subject.name} loop={loop} mode="compact" />;
};

export { SubjectPreview };
