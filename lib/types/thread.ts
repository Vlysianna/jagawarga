import { UserRole } from "./user";

export type ThreadType = "discussion" | "polling" | "announcement" | "event";
type ThreadLevel = Exclude<UserRole, "pemprov">;

export interface ThreadComment {
  id: string;
  threadId: string;
  authorId: string;
  authorName: string;
  authorRole: ThreadLevel;
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
  authorRole: ThreadLevel;
  rt: string;
  rw: string;
  createdAt: string;
  comments: ThreadComment[];

  // polling
  pollOptions?: PollOption[];
  pollDeadline?: string;

  // announcement
  isImportant?: boolean;

  // event
  startDate?: string;
  endDate?: string;
  location?: string;
}

export const THREAD_TYPE_LABELS: Record<ThreadType, string> = {
  discussion: "Diskusi",
  polling: "Polling",
  announcement: "Pengumuman",
  event: "Acara",
};
