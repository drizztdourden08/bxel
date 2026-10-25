/* @layer renderer-app @kind types */
interface Announcement {
  id: number;
  text: string;
}

interface AnnounceState {
  announcement: Announcement | null;
  say: (text: string) => void;
}

export type { AnnounceState };
