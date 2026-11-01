/* @layer renderer-app @kind component */
import { Icon, Tooltip } from '@drizztdourden08/tessera';
import { useAssistantChangedStore } from '../../../stores/useAssistantChangedStore';
import { BADGE_ICON, PANEL_UI } from '../ProjectPanel.constants';
import type { AssistantMarkProps } from '../ProjectPanel.type';
import './AssistantMark.css';

const AssistantMark = ({ item }: AssistantMarkProps) => {
  const assetId = item.row?.assetId ?? null;
  const changed = useAssistantChangedStore((state) => assetId !== null && state.changed[assetId] === true);
  if (!changed) return null;
  return (
    <Tooltip content={PANEL_UI.assistantChanged}>
      <Icon name={BADGE_ICON.assistant} label={PANEL_UI.assistantChanged} size={12} className="project-badges__assistant" />
    </Tooltip>
  );
};

export { AssistantMark };
