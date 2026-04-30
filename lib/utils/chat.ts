import { CHAT_THREADS } from "@/lib/data/chats";
import { USERS } from "@/lib/data/users";
import { ChatThread } from "@/lib/types/chat";
import { AuthUser, User, UserRole } from "@/lib/types/user";
import { getScopeParentId, isWithinScope } from "@/lib/utils/scope";

function findUser(userId: string): User | undefined {
  return USERS.find((user) => user.id === userId);
}

function isCitizenPrivateChat(thread: ChatThread): boolean {
  return (
    thread.type === "private" &&
    thread.participantIds.every((participantId) => {
      const participant = findUser(participantId);
      return participant?.role === "citizen";
    })
  );
}

function canAccessPrivateThread(thread: ChatThread, user: AuthUser): boolean {
  if (!thread.participantIds.includes(user.id)) {
    return false;
  }

  if (user.role === "citizen") {
    return isCitizenPrivateChat(thread);
  }

  return true;
}

function canAccessRtGroup(thread: ChatThread, user: AuthUser): boolean {
  if (!thread.scopeId) {
    return false;
  }

  return (
    (user.role === "citizen" || user.role === "rt") &&
    user.scope_id === thread.scopeId
  );
}

export function canAccessChatThread(thread: ChatThread, user: AuthUser): boolean {
  if (thread.type === "private") {
    return canAccessPrivateThread(thread, user);
  }

  return canAccessRtGroup(thread, user);
}

export function getVisibleChatThreads(user: AuthUser): ChatThread[] {
  return CHAT_THREADS.filter((thread) => canAccessChatThread(thread, user)).sort(
    (a, b) =>
      new Date(getLastMessage(b).createdAt).getTime() -
      new Date(getLastMessage(a).createdAt).getTime()
  );
}

export function getLastMessage(thread: ChatThread) {
  return thread.messages[thread.messages.length - 1];
}

function isAncestorRole(role: UserRole) {
  return role === "rw" || role === "kel" || role === "kec" || role === "pemda";
}

export function getAvailableChatContacts(user: AuthUser): User[] {
  return USERS.filter((candidate) => {
    if (candidate.id === user.id) {
      return false;
    }

    if (user.role === "citizen") {
      return candidate.role === "citizen";
    }

    if (user.role === "rt") {
      return (
        (candidate.role === "citizen" && candidate.scope_id === user.scope_id) ||
        (isAncestorRole(candidate.role) &&
          isWithinScope(user.scope_id, candidate.scope_id))
      );
    }

    if (user.role === "rw") {
      return (
        candidate.role === "rt" ||
        candidate.role === "kel" ||
        candidate.role === "kec" ||
        candidate.role === "pemda"
      ) && isScopeRelated(user, candidate);
    }

    if (user.role === "kel") {
      return (
        candidate.role === "rw" ||
        candidate.role === "rt" ||
        candidate.role === "kec" ||
        candidate.role === "pemda"
      ) && isScopeRelated(user, candidate);
    }

    if (user.role === "kec") {
      return (
        candidate.role === "kel" ||
        candidate.role === "rw" ||
        candidate.role === "rt" ||
        candidate.role === "pemda"
      ) && isScopeRelated(user, candidate);
    }

    if (user.role === "pemda") {
      return (
        candidate.role === "kec" ||
        candidate.role === "kel" ||
        candidate.role === "rw" ||
        candidate.role === "rt"
      ) && isScopeRelated(user, candidate);
    }

    return false;
  }).sort((a, b) => a.name.localeCompare(b.name, "id-ID"));
}

function isScopeRelated(user: AuthUser, candidate: User) {
  return (
    isWithinScope(candidate.scope_id, user.scope_id) ||
    isWithinScope(user.scope_id, candidate.scope_id) ||
    getScopeParentId(user.scope_id) === candidate.scope_id ||
    getScopeParentId(candidate.scope_id) === user.scope_id
  );
}

export function getChatAccessSummary(user: AuthUser): string {
  if (user.role === "citizen") {
    return "Warga hanya bisa membuka chat private dengan sesama warga. Ruang RT hanya muncul untuk warga dan ketua RT yang berada di RT yang sama.";
  }

  if (user.role === "rt") {
    return "Akun RT dapat melihat ruang RT miliknya sendiri, chat private dengan warga di RT yang sama, serta jalur koordinasi ke RW, kelurahan, kecamatan, dan pemda.";
  }

  return "Role ini hanya melihat chat private yang memang melibatkan akunnya. Ruang RT tidak terbuka lintas wilayah.";
}
