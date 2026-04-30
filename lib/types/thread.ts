export type ThreadType = "discussion" | "polling" | "announcement";

export interface ThreadComment {
  id: string;
  threadId: string;
  authorId: string;
  authorName: string;
  authorRole: "citizen" | "rt" | "rw" | "pemda";
  content: string;
  createdAt: string;
  isPinned: boolean;
}

export interface PollOption {
  id: string;
  label: string;
  votes: string[];
}

export interface Thread {
  id: string;
  type: ThreadType;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorRole: "citizen" | "rt" | "rw" | "pemda";
  rt: string;
  rw: string;
  createdAt: string;
  comments: ThreadComment[];

  // polling
  pollOptions?: PollOption[];
  pollDeadline?: string;

  // announcement
  isImportant?: boolean;
}

export const THREAD_TYPE_LABELS: Record<ThreadType, string> = {
  discussion: "Diskusi",
  polling: "Polling",
  announcement: "Pengumuman",
};
