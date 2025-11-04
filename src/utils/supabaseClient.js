import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('⚠️ Supabase environment variables missing');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper to verify connection
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('agents').select('count');
    if (error) throw error;
    console.log('✅ Supabase connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    return false;
  }
};
