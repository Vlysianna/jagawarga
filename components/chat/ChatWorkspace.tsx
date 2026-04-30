"use client";

import { useRef, useState } from "react";
import { MessageSquare, Send, ArrowUpRight } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import { CHAT_TYPE_LABELS, ChatMessage, ChatThread } from "@/lib/types/chat";
import { ROLE_LABELS } from "@/lib/types/user";
import { getAuthUser } from "@/lib/utils/auth";
import {
  getAvailableChatContacts,
  getChatAccessSummary,
  getLastMessage,
  getVisibleChatThreads,
} from "@/lib/utils/chat";

type ChatMode = "all" | "private" | "rt";

function formatMessageTime(value: string) {
  return new Date(value).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function typeStyles(type: "private" | "rt-group") {
  return type === "private"
    ? "bg-green-light text-green-dark"
    : "bg-blue-light text-blue-dark";
}

export default function ChatWorkspace({
  initialMode = "all",
}: {
  initialMode?: ChatMode;
}) {
  const user = getAuthUser();
  const baseThreads = user ? getVisibleChatThreads(user) : [];
  const contacts = user ? getAvailableChatContacts(user) : [];
  const [threads, setThreads] = useState(baseThreads);
  const [selectedId, setSelectedId] = useState("");
  const [draft, setDraft] = useState("");
  const messageCounter = useRef(0);

  if (!user) {
    return null;
  }

  const privateThreads = threads.filter((thread) => thread.type === "private");
  const rtGroupThreads = threads.filter((thread) => thread.type === "rt-group");
  const visiblePrivateThreads = initialMode === "rt" ? [] : privateThreads;
  const visibleRtGroupThreads = initialMode === "private" ? [] : rtGroupThreads;
  const selectableThreads =
    initialMode === "private"
      ? visiblePrivateThreads
      : initialMode === "rt"
        ? visibleRtGroupThreads
        : threads;

  const selectedThread =
    selectableThreads.find((thread) => thread.id === selectedId) ??
    selectableThreads[0] ??
    null;

  function handleSend() {
    if (!user) {
      return null;
    }

    const content = draft.trim();
    if (!content || !selectedThread) {
      return;
    }

    messageCounter.current += 1;

    const nextMessage: ChatMessage = {
      id: `local-${selectedThread.id}-${messageCounter.current}`,
      authorId: user.id,
      authorName: user.name,
      authorRole: user.role,
      content,
      createdAt: new Date().toISOString(),
    };

    setThreads((current) =>
      current
        .map((thread) =>
          thread.id === selectedThread.id
            ? { ...thread, messages: [...thread.messages, nextMessage] }
            : thread,
        )
        .sort(
          (a, b) =>
            new Date(getLastMessage(b).createdAt).getTime() -
            new Date(getLastMessage(a).createdAt).getTime(),
        ),
    );
    setSelectedId(selectedThread.id);
    setDraft("");
  }

  return (
    <div>
      <PageHeader
        title="Chat Wilayah"
        description={getChatAccessSummary(user)}
        icon={MessageSquare}
      />

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <section className="space-y-4">
          <div className="bg-white rounded-2xl border border-neutral-border overflow-hidden">
            <div className="px-4 py-3 border-b border-neutral-border">
              <h2 className="text-sm font-semibold text-foreground">
                Daftar Chat
              </h2>
              <p className="text-xs text-neutral-text mt-1">
                {initialMode === "private"
                  ? "Menampilkan jalur chat private yang bisa diakses akun ini."
                  : initialMode === "rt"
                    ? "Menampilkan ruang RT yang tersedia untuk wilayah akun ini."
                    : "Warga hanya melihat private antarwarga. Akun RT mendapat jalur ke atas."}
              </p>
            </div>
            <div className="p-3 space-y-4">
              <ChatSection
                title="Ruang RT"
                threads={visibleRtGroupThreads}
                selectedId={selectedThread?.id ?? ""}
                onSelect={setSelectedId}
              />
              <ChatSection
                title="Private"
                threads={visiblePrivateThreads}
                selectedId={selectedThread?.id ?? ""}
                onSelect={setSelectedId}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <ArrowUpRight size={16} className="text-blue-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                Kontak yang Bisa Dihubungi
              </h3>
            </div>
            <div className="space-y-2">
              {contacts.slice(0, 8).map((contact) => (
                <div
                  key={contact.id}
                  className="flex flex-col gap-1 rounded-xl bg-neutral-bg px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {contact.name}
                    </p>
                    <p className="text-xs text-neutral-text">
                      {ROLE_LABELS[contact.role]}
                    </p>
                  </div>
                  <span className="text-[11px] text-neutral-text">
                    {contact.detail.kelurahan ??
                      contact.detail.kecamatan ??
                      contact.detail.provinsi}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex min-h-[32rem] flex-col overflow-hidden rounded-2xl border border-neutral-border bg-white">
          {selectedThread ? (
            <>
              <div className="border-b border-neutral-border px-4 py-4 sm:px-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-foreground">
                      {selectedThread.title}
                    </h2>
                    <p className="text-sm text-neutral-text mt-1">
                      {selectedThread.description}
                    </p>
                  </div>
                  <span
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold ${typeStyles(selectedThread.type)}`}
                  >
                    {CHAT_TYPE_LABELS[selectedThread.type]}
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-4 bg-neutral-bg/50 px-4 py-4 sm:px-5 sm:py-5">
                {selectedThread.messages.map((message) => {
                  const isOwn = message.authorId === user.id;

                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl border px-4 py-3 sm:max-w-xl ${
                          isOwn
                            ? "bg-blue-primary text-white border-blue-primary"
                            : "bg-white text-foreground border-neutral-border"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs font-semibold">
                            {message.authorName}
                          </span>
                          <span
                            className={`text-[11px] ${
                              isOwn ? "text-blue-light" : "text-neutral-text"
                            }`}
                          >
                            {ROLE_LABELS[message.authorRole]}
                          </span>
                        </div>
                        <p className="text-sm leading-6">{message.content}</p>
                        <p
                          className={`text-[11px] mt-2 ${
                            isOwn ? "text-blue-light" : "text-neutral-text"
                          }`}
                        >
                          {formatMessageTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-neutral-border px-4 py-4 sm:px-5">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <textarea
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    rows={3}
                    placeholder="Tulis pesan di sini..."
                    className="flex-1 rounded-2xl border border-neutral-border bg-white px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-border"
                  />
                  <Button
                    type="button"
                    onClick={handleSend}
                    className="self-stretch sm:self-end"
                  >
                    <Send size={16} className="mr-2" />
                    Kirim
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center px-6">
              <div>
                <MessageSquare
                  size={48}
                  className="mx-auto text-neutral-border mb-4"
                />
                <p className="text-sm text-neutral-text">
                  Belum ada chat yang tersedia untuk role ini.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function ChatSection({
  title,
  threads,
  selectedId,
  onSelect,
}: {
  title: string;
  threads: ChatThread[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  if (threads.length === 0) {
    return null;
  }

  return (
    <div>
      <p className="px-1 pb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-text">
        {title}
      </p>
      <div className="space-y-2">
        {threads.map((thread) => {
          const lastMessage = getLastMessage(thread);
          const active = thread.id === selectedId;

          return (
            <button
              key={thread.id}
              type="button"
              onClick={() => onSelect(thread.id)}
              className={`w-full rounded-xl border text-left px-3 py-3 transition-colors cursor-pointer ${
                active
                  ? "bg-blue-light/60 border-blue-border"
                  : "border-neutral-border hover:bg-neutral-bg"
              }`}
            >
              <div className="mb-1.5 flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-foreground line-clamp-1">
                  {thread.title}
                </p>
                <span
                  className={`hidden shrink-0 rounded-lg px-2 py-1 text-[11px] font-semibold sm:inline-flex ${typeStyles(thread.type)}`}
                >
                  {CHAT_TYPE_LABELS[thread.type]}
                </span>
              </div>
              <p className="text-xs text-neutral-text line-clamp-2">
                {lastMessage.authorName}: {lastMessage.content}
              </p>
              <p className="text-[11px] text-neutral-text mt-2">
                {formatMessageTime(lastMessage.createdAt)}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
