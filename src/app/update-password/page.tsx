"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setMessage("Erreur : " + error.message);
    } else {
      setMessage("Mot de passe mis à jour ! Redirection...");
      setTimeout(() => router.push("/admin"), 2000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-hr-warm flex items-center justify-center px-4">
      <div className="bg-white border border-hr-border rounded-xl p-8 w-full max-w-sm shadow-sm">
        <h1 className="text-center text-sm font-medium tracking-[0.3em] text-hr-dark mb-1">
          HR WEAR
        </h1>
        <p className="text-center text-[10px] text-hr-hint tracking-widest mb-8">
          NOUVEAU MOT DE PASSE
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] text-hr-hint tracking-widest mb-1.5">
              MOT DE PASSE
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full border border-hr-border rounded-md px-3 py-2.5 text-sm text-hr-dark focus:outline-none focus:border-hr-brown"
            />
          </div>
          <div>
            <label className="block text-[10px] text-hr-hint tracking-widest mb-1.5">
              CONFIRMER
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="w-full border border-hr-border rounded-md px-3 py-2.5 text-sm text-hr-dark focus:outline-none focus:border-hr-brown"
            />
          </div>

          {message && (
            <p className={`text-xs ${message.includes("Erreur") || message.includes("correspondent") ? "text-red-500" : "text-green-600"}`}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-hr-dark text-white text-xs tracking-widest py-3 rounded-md hover:bg-hr-brown disabled:opacity-50"
          >
            {loading ? "..." : "METTRE À JOUR"}
          </button>
        </form>
      </div>
    </div>
  );
}
