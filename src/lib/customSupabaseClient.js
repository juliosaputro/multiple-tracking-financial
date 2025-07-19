import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://milfuptrjjqxlmissdbj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pbGZ1cHRyampxeGxtaXNzZGJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NDY4NTAsImV4cCI6MjA2ODIyMjg1MH0.rzNQoVW4kHpOgcF0AyAPufnbVhbIa98ghP30BMR_DVg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);