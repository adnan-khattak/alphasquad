import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace these with your actual Supabase project URL and anon key
const supabaseUrl = 'https://tvyiuzdxoyvittxmfnjk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2eWl1emR4b3l2aXR0eG1mbmprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNTY2MDcsImV4cCI6MjA3NDYzMjYwN30.uAVyeKUgEmg5V-QCu9JbnXvanFNE7xtKjVoz73KS7Dc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export default supabase;
