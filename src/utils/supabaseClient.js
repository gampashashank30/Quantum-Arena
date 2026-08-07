import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL && 
  SUPABASE_ANON_KEY && 
  SUPABASE_URL !== 'https://your-project-id.supabase.co'
);

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

/* ==================== MOCK SESSION FOR DEMO / OFFLINE ==================== */
let mockUser = null;
const mockListeners = [];

/* ==================== AUTHENTICATION API ==================== */

export async function signUpWithEmail(email, password, fullName = '') {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    });
    if (error) throw error;
    return data;
  }

  // Demo fallback
  mockUser = {
    id: `demo_${Date.now()}`,
    email,
    user_metadata: { full_name: fullName || email.split('@')[0] },
    isDemo: true
  };
  triggerMockAuthChange('SIGNED_IN', mockUser);
  return { user: mockUser };
}

export async function signInWithEmail(email, password) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  }

  // Demo fallback
  mockUser = {
    id: `demo_${Date.now()}`,
    email,
    user_metadata: { full_name: email.split('@')[0] },
    isDemo: true
  };
  triggerMockAuthChange('SIGNED_IN', mockUser);
  return { user: mockUser };
}

export async function signInAsGuest() {
  const guestUser = {
    id: 'guest_arena_user',
    email: 'guest@quantum-arena.dev',
    user_metadata: { full_name: 'Arena Guest' },
    isDemo: true
  };
  mockUser = guestUser;
  triggerMockAuthChange('SIGNED_IN', mockUser);
  return { user: mockUser };
}

export async function signOutUser() {
  if (isSupabaseConfigured) {
    await supabase.auth.signOut();
  }
  mockUser = null;
  triggerMockAuthChange('SIGNED_OUT', null);
}

export async function getCurrentSession() {
  if (isSupabaseConfigured) {
    const { data } = await supabase.auth.getSession();
    return data.session;
  }
  return mockUser ? { user: mockUser } : null;
}

export function onAuthChange(callback) {
  if (isSupabaseConfigured) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
    return subscription;
  }

  mockListeners.push(callback);
  return {
    unsubscribe: () => {
      const idx = mockListeners.indexOf(callback);
      if (idx > -1) mockListeners.splice(idx, 1);
    }
  };
}

function triggerMockAuthChange(event, user) {
  const session = user ? { user } : null;
  mockListeners.forEach(cb => cb(event, session));
}

/* ==================== CLOUD DATABASE SYNC ==================== */

export async function saveCloudSnippet(snippet, userId) {
  if (!isSupabaseConfigured || !userId) return null;
  const { data, error } = await supabase
    .from('snippets')
    .insert([{
      user_id: userId,
      title: snippet.title,
      language: snippet.language,
      filename: snippet.filename,
      code: snippet.code,
      tags: snippet.tags || ['custom']
    }])
    .select();

  if (error) {
    console.warn("Supabase save snippet error:", error);
    return null;
  }
  return data;
}

export async function fetchCloudSnippets(userId) {
  if (!isSupabaseConfigured || !userId) return [];
  const { data, error } = await supabase
    .from('snippets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.warn("Supabase fetch snippets error:", error);
    return [];
  }
  return data || [];
}

export async function saveCloudExecutionHistory(entry, userId) {
  if (!isSupabaseConfigured || !userId) return null;
  const { data, error } = await supabase
    .from('execution_history')
    .insert([{
      user_id: userId,
      filename: entry.filename,
      language: entry.language,
      code: entry.code,
      status: entry.status,
      duration_ms: entry.dur,
      memory_kb: entry.memKB,
      exit_code: entry.exitCode
    }]);

  if (error) {
    console.warn("Supabase save execution history error:", error);
  }
  return data;
}
