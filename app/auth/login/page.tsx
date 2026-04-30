"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { login, getDashboardPath } from "@/lib/utils/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = login(email, password);

    if (result.success) {
      router.push(getDashboardPath(result.user.role));
    } else {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-blue-border/50 overflow-hidden">
      {/* Card Header */}
      <div className="bg-blue-primary px-4 py-5 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-white">Masuk</h1>
        <p className="text-blue-border mt-1 text-sm">
          Masuk ke akun JagaWarga Anda
        </p>
      </div>

      {/* Card Body */}
      <div className="space-y-6 px-4 py-6 sm:px-6">
        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="example@local.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <div className="bg-red-light border border-red-danger/20 rounded-xl px-4 py-3 text-sm text-red-dark">
              {error}
            </div>
          )}

          <Button
            type="submit"
            fullWidth
            size="lg"
            disabled={loading || !email || !password}
          >
            {loading ? "Memproses..." : "Masuk"}
          </Button>
        </form>

        {/* Info */}
        <p className="text-center text-sm text-neutral-text">
          Akun dibuat oleh pengurus RT/RW atau Pemda.
          <br />
          Hubungi pengurus wilayah Anda untuk mendaftar.
        </p>
      </div>
    </div>
  );
}
