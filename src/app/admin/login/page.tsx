"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-hr-warm flex items-center justify-center px-4">
      <div className="bg-white border border-hr-border rounded-lg p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-xl font-medium text-hr-dark tracking-[0.3em]">HR WEAR</p>
          <p className="text-[10px] text-hr-hint tracking-widest mt-1">ESPACE GÉRANT</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[10px] text-hr-hint tracking-widest mb-1.5">EMAIL</label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full border border-hr-border rounded px-3 py-2.5 text-sm text-hr-dark bg-white focus:outline-none focus:border-hr-brown"
            />
          </div>
          <div>
            <label className="block text-[10px] text-hr-hint tracking-widests mb-1.5">MOT DE PASSE</label>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="w-full border border-hr-border rounded px-3 py-2.5 text-sm text-hr-dark bg-white focus:outline-none focus:border-hr-brown"
            />
          </div>
          {error && <p className="text-xs text-hr-promo">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full bg-hr-dark text-white text-xs tracking-widest py-3 rounded-sm hover:bg-hr-brown disabled:opacity-60 mt-2"
          >
            {loading ? "CONNEXION..." : "SE CONNECTER"}
          </button>
        </form>
      </div>
    </div>
  );
}
