/* @layer renderer-app @kind component */
import { Disclosure } from '@drizztdourden08/tessera';
import { ATLAS_TEXT } from '../../../../sheet-manager/manager-text.constants';
import { useManagerStore } from '../../../../stores/useManagerStore';
import type { ManagerModelProps } from '../../SpritesPanel.type';
import { LayoutBody } from './sub-components/LayoutBody';
import './LayoutSection.css';

const LayoutSection = ({ model }: ManagerModelProps) => {
  const open = useManagerStore((state) => state.layoutOpen);
  const patch = useManagerStore((state) => state.patch);
  if (!model.sheet) return null;
  return (
    <Disclosure summary={ATLAS_TEXT.section} size="sm" open={open} onOpenChange={(next) => patch({ layoutOpen: next })} className="layout-section">
      {open && <LayoutBody model={model} />}
    </Disclosure>
  );
};

export { LayoutSection };
