"use client";

import { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import { PollOption } from "@/lib/types/thread";
import { getAuthUser } from "@/lib/utils/auth";
import { getVoterId } from "@/lib/types/user";

interface PollVoteProps {
  options: PollOption[];
  deadline?: string;
}

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

export default function PollVote({ options, deadline }: PollVoteProps) {
  const [localOptions, setLocalOptions] = useState(options);
  const [selection, setSelection] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const user = getAuthUser();
  const voterId = user ? getVoterId(user) : null;

  useEffect(() => {
    setLocalOptions(options);
  }, [options]);

  useEffect(() => {
    if (!voterId) return;
    const votedOption = options.find((option) =>
      option.votes.includes(voterId)
    );
    if (votedOption) {
      setSelection(votedOption.id);
    }
  }, [options, voterId]);

  const totalVotes = useMemo(() => {
    return localOptions.reduce(
      (sum, option) => sum + option.votes.length,
      0
    );
  }, [localOptions]);

  const deadlineDate = deadline ? new Date(deadline) : null;
  const isClosed = deadlineDate ? deadlineDate.getTime() < Date.now() : false;

  const selectedLabel = selection
    ? localOptions.find((option) => option.id === selection)?.label
    : null;

  function handleVote() {
    setNotice(null);

    if (isClosed) {
      setNotice("Voting sudah ditutup.");
      return;
    }

    if (!voterId) {
      setNotice("Silakan login untuk memberikan suara.");
      return;
    }

    if (!selection) {
      setNotice("Pilih salah satu opsi terlebih dahulu.");
      return;
    }

    setLocalOptions((prev) =>
      prev.map((option) => {
        const filteredVotes = option.votes.filter(
          (vote) => vote !== voterId
        );

        if (option.id === selection) {
          return {
            ...option,
            votes: [...filteredVotes, voterId],
          };
        }

        return { ...option, votes: filteredVotes };
      })
    );

    setNotice("Terima kasih, suara Anda tercatat untuk sesi ini.");
  }

  return (
    <div className="border border-neutral-border rounded-xl p-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <p className="text-sm font-medium text-foreground">Voting Warga</p>
        <p className="text-xs text-neutral-text">
          Total suara: {totalVotes}
        </p>
      </div>

      {deadline && (
        <p className="text-xs text-neutral-text mt-1">
          Batas waktu: {formatDateTime(deadline)}
        </p>
      )}

      <div className="mt-4 space-y-3">
        {localOptions.map((option) => (
          <label
            key={option.id}
            className="flex items-center justify-between gap-3 border border-neutral-border rounded-xl px-3 py-2 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="poll-option"
                value={option.id}
                checked={selection === option.id}
                onChange={() => setSelection(option.id)}
                disabled={isClosed}
              />
              <span className="text-sm text-neutral-dark">{option.label}</span>
            </div>
            <span className="text-xs text-neutral-text">
              {option.votes.length} suara
            </span>
          </label>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button
          type="button"
          size="sm"
          onClick={handleVote}
          disabled={isClosed}
        >
          {selectedLabel ? "Kirim suara" : "Pilih opsi"}
        </Button>
        {selectedLabel && (
          <span className="text-xs text-neutral-text">
            Pilihan Anda: {selectedLabel}
          </span>
        )}
      </div>

      {notice && (
        <p className="mt-3 text-xs text-neutral-text">{notice}</p>
      )}
      {isClosed && (
        <p className="mt-2 text-xs text-red-dark">
          Voting telah ditutup.
        </p>
      )}
    </div>
  );
}
