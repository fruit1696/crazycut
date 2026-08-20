import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createSupabaseClient(supabaseUrl, supabaseKey);

// ─── Fabric field mappers ─────────────────────────────────────────────────
// Supabase uses price_per_metre; the frontend/AdminFabricEdit uses price.
// All other field names are identical between the two.
export const fabricToFrontend = (row) => {
  if (!row) return row;
  const { price_per_metre, ...rest } = row;
  return { ...rest, price: price_per_metre };
};

export const fabricToDb = (payload) => {
  if (!payload) return payload;
  const { price, ...rest } = payload;
  const mapped = { ...rest };
  if (price !== undefined) mapped.price_per_metre = price;
  if (typeof mapped.sku === 'string' && mapped.sku.trim() === '') mapped.sku = null;
  return mapped;
};
