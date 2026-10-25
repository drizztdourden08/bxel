/* @layer renderer-app @kind hook */
import { useAnnounceMode } from './useAnnounceMode';
import { useAnnounceSaved } from './useAnnounceSaved';
import { useAnnounceTool } from './useAnnounceTool';

const useEditorAnnouncements = (): void => {
  useAnnounceSaved();
  useAnnounceTool();
  useAnnounceMode();
};

export { useEditorAnnouncements };
