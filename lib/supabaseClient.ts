import { createClient } from '@supabase/supabase-js';

let client: any = null;

function getClient() {
  if (!client) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn("Supabase environment variables are missing.");
      return null;
    }
    client = createClient(supabaseUrl, supabaseAnonKey);
  }
  return client;
}

export const supabase = {
  auth: {
    getSession: async () => {
      const c = getClient();
      return c ? await c.auth.getSession() : { data: { session: null }, error: null };
    },
    onAuthStateChange: (callback: any) => {
      const c = getClient();
      return c ? c.auth.onAuthStateChange(callback) : { data: { subscription: { unsubscribe: () => {} } } };
    },
    signInWithOAuth: async (options: any) => {
      const c = getClient();
      return c ? await c.auth.signInWithOAuth(options) : { data: null, error: new Error("Supabase not initialized") };
    },
  },
};
