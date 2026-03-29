import { supabase } from './supabase';

export async function signInWithMagicLink(email) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: 'https://autumn-lgtm.github.io/NeuroLeader/',
      shouldCreateUser: true,
    }
  });
  return error;
}

export async function signOut() {
  await supabase.auth.signOut();
  localStorage.removeItem('nl_profile');
  localStorage.removeItem('nl_session_id');
  localStorage.removeItem('nl_last_sync');
  localStorage.removeItem('nl_session_start');
}

export function onAuthChange(callback) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null, event);
  });
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
