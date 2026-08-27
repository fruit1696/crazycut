import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createSupabaseClient(supabaseUrl, supabaseKey);

// ─── Fabric field mappers ─────────────────────────────────────────────────
export const fabricToFrontend = (row) => row;

export const fabricToDb = (payload) => {
  if (!payload) return payload;
  const mapped = { ...payload };
  if (typeof mapped.sku === 'string' && mapped.sku.trim() === '') mapped.sku = null;
  return mapped;
};
