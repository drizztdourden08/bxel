/* @layer renderer-app @kind logic */
import { RECENT_LIMIT } from '../../stores/tool-store.constants';
import type { ToolSettings } from '../../stores/tool-store.type';

const recentChange = (settings: ToolSettings, memberId: string): Partial<ToolSettings> => {
  const list = settings.recentMembers[settings.activeSurface];
  if (list[0] === memberId) return {};
  const next = [memberId, ...list.filter((each) => each !== memberId)].slice(0, RECENT_LIMIT);
  return { recentMembers: { ...settings.recentMembers, [settings.activeSurface]: next } };
};

export { recentChange };
