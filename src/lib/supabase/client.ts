import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || url.includes("VOTRE_PROJECT_ID") || !key || key.includes("VOTRE_ANON_KEY")) {
    // Supabase pas encore configuré — retourne un client factice
    const resolved = Promise.resolve({ data: [], error: null, count: 0 });

    const makeChain = (): any => {
      const p = Promise.resolve({ data: [], error: null, count: 0 });
      const chain: any = new Proxy(p, {
        get(target: any, prop: string) {
          if (prop === "then" || prop === "catch" || prop === "finally") {
            return target[prop].bind(target);
          }
          return (..._args: any[]) => makeChain();
        },
      });
      return chain;
    };

    return {
      from: (_table: string) => makeChain(),
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        signInWithPassword: () =>
          Promise.resolve({ data: null, error: { message: "Supabase non configuré" } }),
        signOut: () => Promise.resolve({ error: null }),
        onAuthStateChange: (_cb: any) => ({
          data: { subscription: { unsubscribe: () => {} } },
        }),
      },
      rpc: (_fn: string, _args?: any) => resolved,
      storage: {
        from: (_bucket: string) => ({
          upload: () => resolved,
          getPublicUrl: () => ({ data: { publicUrl: "" } }),
        }),
      },
    } as any;
  }

  return createBrowserClient(url, key);
}
