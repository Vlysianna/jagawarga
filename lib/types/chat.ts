import { UserRole } from "./user";

export type ChatType = "private" | "rt-group";

export interface ChatMessage {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  content: string;
  createdAt: string;
}

export interface ChatThread {
  id: string;
  type: ChatType;
  title: string;
  description: string;
  scopeId?: string;
  participantIds: string[];
  messages: ChatMessage[];
}

export const CHAT_TYPE_LABELS: Record<ChatType, string> = {
  private: "Private",
  "rt-group": "Ruang RT",
};
