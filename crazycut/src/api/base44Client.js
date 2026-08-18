import { createClient as createBase44Client } from '@base44/sdk';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { appParams } from '@/lib/app-params';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

// Keep original base44 client exclusively for functions
const base44Original = createBase44Client({
  appId,
  token,
  functionsVersion,
  serverUrl: '',
  requiresAuth: false,
  appBaseUrl
});

// Create Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createSupabaseClient(supabaseUrl, supabaseKey);

// ─── Fabric field mappers ─────────────────────────────────────────────────
// Supabase uses price_per_metre; the frontend/AdminFabricEdit uses price.
// All other field names are identical between the two.
const fabricToFrontend = (row) => {
  if (!row) return row;
  const { price_per_metre, ...rest } = row;
  return { ...rest, price: price_per_metre };
};

const fabricToDb = (payload) => {
  if (!payload) return payload;
  const { price, ...rest } = payload;
  const mapped = { ...rest };
  if (price !== undefined) mapped.price_per_metre = price;
  return mapped;
};

// Hybrid proxy replacing Base44 ORM with Supabase
export const base44 = {
  auth: {
    loginViaEmailPassword: async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
      return data;
    },
    loginWithProvider: async (provider, returnTo) => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: returnTo }
      });
      if (error) throw new Error(error.message);
    },
    register: async ({ email, password }) => {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw new Error(error.message);
    },
    verifyOtp: async ({ email, otpCode }) => {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: 'signup'
      });
      if (error) throw new Error(error.message);
      return { access_token: data.session?.access_token };
    },
    resendOtp: async (email) => {
      const { error } = await supabase.auth.resend({ type: 'signup', email });
      if (error) throw new Error(error.message);
    },
    resetPasswordRequest: async (email) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw new Error(error.message);
    },
    resetPassword: async ({ newPassword }) => {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw new Error(error.message);
    },
    me: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        const err = new Error("Not authenticated");
        err.status = 401;
        throw err;
      }
      
      const user = session.user;
      return {
        ...user,
        role: user.app_metadata?.role || 'user'
      };
    },
    setToken: (token) => {}, // No-op, Supabase handles token storage
    logout: async (redirectUrl) => {
      await supabase.auth.signOut();
      if (redirectUrl) window.location.href = redirectUrl;
    },
    redirectToLogin: (returnUrl) => {
      window.location.href = `/login?returnTo=${encodeURIComponent(returnUrl)}`;
    }
  },
  
  entities: {
    Fabric: {
      list: async (sortString, limit) => {
        let query = supabase.from('fabrics').select('*');
        if (sortString === '-created_date') {
          query = query.order('created_date', { ascending: false });
        }
        if (limit) query = query.limit(limit);
        const { data, error } = await query;
        if (error) throw new Error(error.message);
        return (data || []).map(fabricToFrontend);
      },
      get: async (id) => {
        const { data, error } = await supabase.from('fabrics').select('*').eq('id', id).single();
        if (error) throw new Error(error.message);
        return fabricToFrontend(data);
      },
      create: async (payload) => {
        const { data, error } = await supabase.from('fabrics').insert(fabricToDb(payload)).select().single();
        if (error) throw new Error(error.message);
        return fabricToFrontend(data);
      },
      update: async (id, payload) => {
        const { data, error } = await supabase.from('fabrics').update(fabricToDb(payload)).eq('id', id).select().single();
        if (error) throw new Error(error.message);
        return fabricToFrontend(data);
      },
      delete: async (id) => {
        const { error } = await supabase.from('fabrics').delete().eq('id', id);
        if (error) throw new Error(error.message);
      }
    },
    Order: {
      create: async (payload) => {
        // Extract items array
        const { items, ...orderData } = payload;
        
        // Check if user is logged in
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          orderData.user_id = session.user.id;
        } else {
          orderData.user_id = null;
        }

        // Insert order
        const { data: order, error: orderErr } = await supabase.from('orders').insert(orderData).select().single();
        if (orderErr) throw new Error(orderErr.message);

        // Insert items
        if (items && items.length > 0) {
          const itemsPayload = items.map(item => ({
            ...item,
            order_id: order.id
          }));
          const { error: itemsErr } = await supabase.from('order_items').insert(itemsPayload);
          if (itemsErr) throw new Error(itemsErr.message);
        }
        
        return order;
      },
      filter: async (queryObj, sortString, limit) => {
        // Order filter used in Orders.jsx passes empty queryObj, expecting RLS to scope to user
        let query = supabase.from('orders').select('*, items:order_items(*)');
        if (sortString === '-created_date') {
          query = query.order('created_date', { ascending: false });
        }
        if (limit) query = query.limit(limit);
        const { data, error } = await query;
        if (error) throw new Error(error.message);
        return data;
      },
      list: async (sortString, limit) => {
        // Same exact query structure, used by AdminDashboard
        let query = supabase.from('orders').select('*, items:order_items(*)');
        if (sortString === '-created_date') {
          query = query.order('created_date', { ascending: false });
        }
        if (limit) query = query.limit(limit);
        const { data, error } = await query;
        if (error) throw new Error(error.message);
        return data;
      },
      update: async (id, payload) => {
        const { data, error } = await supabase.from('orders').update(payload).eq('id', id).select().single();
        if (error) throw new Error(error.message);
        return data;
      }
    }
  },
  
  integrations: {
    Core: {
      UploadFile: async ({ file }) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
        const { error } = await supabase.storage.from('fabrics').upload(fileName, file);
        if (error) throw new Error(error.message);
        
        const { data } = supabase.storage.from('fabrics').getPublicUrl(fileName);
        return { file_url: data.publicUrl };
      }
    }
  },
  
  functions: {
    invoke: async (functionName, payload) => {
      // Pass-through to original Base44 SDK for VisualizeGarment
      return base44Original.functions.invoke(functionName, payload);
    }
  }
};
