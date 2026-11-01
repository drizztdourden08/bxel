/* @layer renderer-app @kind types */
import type { ViewMode } from '../panel-browser/project-browser.type';

type PanelSnapshot = {
  readonly mode: ViewMode;
  readonly selection: readonly string[];
  readonly text: string;
  readonly chips: readonly string[];
};

type PanelCommand = {
  readonly mode?: ViewMode;
  readonly selection?: readonly string[];
  readonly text?: string;
  readonly chips?: readonly string[];
};

interface ProjectPanelLinkState {
  snapshot: PanelSnapshot | null;
  command: PanelCommand | null;
  publish: (snapshot: PanelSnapshot | null) => void;
  send: (command: PanelCommand) => void;
  take: () => PanelCommand | null;
}

export type { PanelCommand, PanelSnapshot, ProjectPanelLinkState };
