"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import PollVote from "@/components/citizen/PollVote";
import Button from "@/components/ui/Button";
import { THREADS } from "@/lib/data/threads";
import { ThreadComment, THREAD_TYPE_LABELS } from "@/lib/types/thread";
import { getAuthUser } from "@/lib/utils/auth";

function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(value?: string): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Page() {
  const params = useParams();
  const threadId = Array.isArray(params.id) ? params.id[0] : params.id;
  const thread = THREADS.find((item) => item.id === threadId);
  const [comments, setComments] = useState<ThreadComment[]>(
    thread ? thread.comments : []
  );
  const [commentText, setCommentText] = useState("");
  const [commentNotice, setCommentNotice] = useState<string | null>(null);
  const user = getAuthUser();

  useEffect(() => {
    if (thread) {
      setComments(thread.comments);
    }
  }, [thread]);

  if (!thread) {
    return (
      <div className="space-y-4">
        <Link
          href="/citizen/dashboard"
          className="text-sm font-medium text-blue-primary hover:text-blue-dark"
        >
          Kembali ke dashboard
        </Link>
        <div className="bg-white border border-neutral-border rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-foreground">
            Thread tidak ditemukan
          </h2>
          <p className="text-sm text-neutral-text mt-2">
            Kami tidak menemukan thread dengan ID tersebut.
          </p>
        </div>
      </div>
    );
  }

  const totalVotes = thread.pollOptions
    ? thread.pollOptions.reduce(
        (sum, option) => sum + option.votes.length,
        0
      )
    : 0;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCommentNotice(null);

    if (!user) {
      setCommentNotice("Silakan login untuk menulis komentar.");
      return;
    }

    const trimmed = commentText.trim();
    if (!trimmed) {
      setCommentNotice("Komentar tidak boleh kosong.");
      return;
    }

    const authorRole = user.role === "pemprov" ? "pemda" : user.role;

    const newComment: ThreadComment = {
      id: `c-${Date.now()}`,
      threadId: thread.id,
      authorId: user.id,
      authorName: user.name,
      authorRole: authorRole as ThreadComment["authorRole"],
      content: trimmed,
      createdAt: new Date().toISOString(),
      isPinned: false,
    };

    setComments((prev) => [newComment, ...prev]);
    setCommentText("");
    setCommentNotice("Komentar berhasil ditambahkan (lokal).");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link
          href="/citizen/dashboard"
          className="text-sm font-medium text-blue-primary hover:text-blue-dark"
        >
          Kembali ke dashboard
        </Link>
        <span className="text-xs text-neutral-text">
          Dibuat {formatDateTime(thread.createdAt)}
        </span>
      </div>

      <section className="bg-white border border-neutral-border rounded-2xl p-4 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-neutral-bg text-neutral-dark">
            {THREAD_TYPE_LABELS[thread.type]}
          </span>
          {thread.isImportant && (
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-light text-red-dark">
              Penting
            </span>
          )}
          <span className="text-xs text-neutral-text">
            RT {thread.rt} / RW {thread.rw}
          </span>
        </div>

        <h1 className="mt-3 text-2xl font-bold text-foreground">
          {thread.title}
        </h1>
        <p className="text-sm text-neutral-text mt-1">
          Oleh {thread.authorName}
        </p>

        <div className="mt-4 text-base text-neutral-dark whitespace-pre-line">
          {thread.content}
        </div>

        {thread.pollOptions && (
          <div className="mt-6">
            <PollVote options={thread.pollOptions} deadline={thread.pollDeadline} />
            <p className="mt-2 text-xs text-neutral-text">
              Total suara: {totalVotes}
            </p>
          </div>
        )}

        {(thread.startDate || thread.endDate || thread.location) && (
          <div className="mt-6 border border-neutral-border rounded-xl p-4">
            <h2 className="text-sm font-semibold text-foreground">
              Detail Acara
            </h2>
            <div className="mt-2 grid gap-2 text-sm text-neutral-text">
              <p>Mulai: {formatDate(thread.startDate)}</p>
              <p>Selesai: {formatDate(thread.endDate)}</p>
              <p>Lokasi: {thread.location || "-"}</p>
            </div>
          </div>
        )}
      </section>

      <section className="bg-white border border-neutral-border rounded-2xl p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-foreground">Komentar</h2>
          <span className="text-xs text-neutral-text">
            {comments.length} komentar
          </span>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-4 border border-neutral-border rounded-xl p-4 sm:p-5"
        >
          <p className="text-sm font-medium text-foreground">
            Tulis komentar
          </p>
          <p className="text-xs text-neutral-text mt-1">
            {user ? `Masuk sebagai ${user.name}` : "Masuk untuk berkomentar"}
          </p>
          <textarea
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            placeholder="Tulis komentar Anda di sini"
            rows={4}
            className="mt-3 w-full rounded-xl border border-neutral-border px-3 py-2 text-sm text-neutral-dark placeholder:text-neutral-text/60 focus:outline-none focus:ring-2 focus:ring-blue-border"
          />
          {commentNotice && (
            <p className="mt-2 text-xs text-neutral-text">{commentNotice}</p>
          )}
          <div className="mt-3 flex justify-end">
            <Button type="submit" size="sm" disabled={!commentText.trim()}>
              Kirim komentar
            </Button>
          </div>
        </form>

        <div className="mt-4 space-y-3">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="border border-neutral-border rounded-xl p-4"
            >
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">
                    {comment.authorName}
                  </p>
                  {comment.isPinned && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-light text-blue-dark">
                      Pin
                    </span>
                  )}
                </div>
                <span className="text-xs text-neutral-text">
                  {formatDateTime(comment.createdAt)}
                </span>
              </div>
              <p className="text-sm text-neutral-text mt-2">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
