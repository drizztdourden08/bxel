/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useState } from 'react';
import type { OpenProject, ProjectLocation } from '../../../project/project.type';
import { START_LOCATION } from '../ProjectPanel.constants';
import type { Located } from '../ProjectPanel.type';

const useProjectLocation = (project: OpenProject | null): Located => {
  const [location, setLocation] = useState<ProjectLocation>(START_LOCATION);
  const projectId = project?.manifest.projectId;

  useEffect(() => setLocation(START_LOCATION), [projectId]);

  const chooseFolder = useCallback((folderId: string) => setLocation({ folderId, segments: [] }), []);
  const enter = useCallback((name: string) => setLocation((now) => ({ ...now, segments: [...now.segments, name] })), []);
  const up = useCallback(() => setLocation((now) => ({ ...now, segments: now.segments.slice(0, -1) })), []);

  const folder = project?.folders.find((each) => each.folderId === location.folderId) ?? project?.folders[0] ?? null;
  return { folder, segments: location.segments, chooseFolder, enter, up };
};

export { useProjectLocation };
