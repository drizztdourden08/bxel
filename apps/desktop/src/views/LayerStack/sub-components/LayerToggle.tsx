/* @layer renderer-app @kind component */
import { Icon, IconButton } from '@drizztdourden08/tessera';
import { ActionHint } from '../../ActionHint';
import { LAYER_FLAG_HINTS, LAYER_FLAG_ICONS } from '../LayerStack.constants';
import type { LayerToggleProps } from '../LayerStack.type';

const LayerToggle = ({ row, flag, sweep }: LayerToggleProps) => {
  const stored = flag === 'visible' ? row.visible && !row.mixedVisible : row.lock !== 'none';
  const on = sweep.pending(row.id, flag) ?? stored;
  const mixed = flag === 'visible' ? row.mixedVisible : row.mixedLock;
  const icons = LAYER_FLAG_ICONS[flag];
  return (
    <ActionHint hint={LAYER_FLAG_HINTS[flag]}>
      <IconButton
        variant="ghost"
        size="sm"
        label={LAYER_FLAG_HINTS[flag].name}
        aria-pressed={mixed ? 'mixed' : on}
        tabIndex={-1}
        className="layer-row__toggle"
        data-flag={flag}
        data-on={on ? 'yes' : 'no'}
        data-kind={flag === 'locked' ? row.lock : undefined}
        data-mixed={mixed ? 'yes' : undefined}
        {...sweep.handlers(row, flag)}
      >
        <Icon name={on ? icons.on : icons.off} size={16} />
      </IconButton>
    </ActionHint>
  );
};

export { LayerToggle };
