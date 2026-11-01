/* @layer renderer-app @kind component */
import { usePaletteTarget } from '../../hooks/usePaletteTarget';
import { useRampBuilderStore } from '../../stores/useRampBuilderStore';
import { BuilderDialog } from './sub-components/BuilderDialog';
import './RampBuilderDialog.css';

const RampBuilderDialog = () => {
  const request = useRampBuilderStore((state) => state.request);
  const target = usePaletteTarget();
  if (!request || target?.documentId !== request.documentId) return null;
  return <BuilderDialog request={request} live={target} />;
};

export { RampBuilderDialog };
