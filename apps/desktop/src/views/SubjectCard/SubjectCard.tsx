/* @layer renderer-app @kind component */
import { Box } from '@drizztdourden08/tessera';
import { isArtworkPath } from '../../files/is-artwork-path';
import { useSubject } from '../../properties-subject/useSubject';
import { FileSummary } from './sub-components/FileSummary';
import { MissingNotice } from './sub-components/MissingNotice';
import { SubjectPreview } from './sub-components/SubjectPreview';
import './SubjectCard.css';

const SubjectCard = () => {
  const state = useSubject();
  if (state.status === 'none') return null;
  if (state.status === 'missing') {
    const { path } = state.ref;
    return path !== null && !isArtworkPath(path) ? <FileSummary path={path} /> : <MissingNotice />;
  }
  const { subject } = state;
  return (
    <Box className="subject-card" role="region" aria-label={subject.name}>
      <SubjectPreview subject={subject} />
    </Box>
  );
};

export { SubjectCard };
