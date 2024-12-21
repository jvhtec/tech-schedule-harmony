import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://dkprgpegpbuumzhkenym.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrcHJncGVncGJ1dW16aGtlbnltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzODUyNjcsImV4cCI6MjA0OTk2MTI2N30.zX_5NBYJi5vSSqroMUaTErzSjlSPtpxir85T0nw7mnU";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);