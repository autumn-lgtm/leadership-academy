import { supabase } from './supabase';

export async function signInWithMagicLink(email) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: 'https://autumn-lgtm.github.io/NeuroLeader/',
    },
  });
  return { error };
}
