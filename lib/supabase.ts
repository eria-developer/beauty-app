import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://aqijhcorftlytejnsgiu.supabase.co/";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxaWpoY29yZnRseXRlam5zZ2l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUyMDE3NzMsImV4cCI6MjA0MDc3Nzc3M30.LaIUWhOvQq5DYchBZc_kSIYqwN7YRRso6SOFmKjo7js";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
