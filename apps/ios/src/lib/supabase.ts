import "react-native-url-polyfill/auto";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tvnbxvjnyztawnwobqxf.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2bmJ4dmpueXp0YXdud29icXhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4ODM4ODksImV4cCI6MjEwMjQ1OTg4OX0.crBlRZhWRUhmMU9C5b3nl--r2HzlmehZtOV9sgKuvws";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
