// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://htslkefkyvgfbucanptk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0c2xrZWZreXZnZmJ1Y2FucHRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMjY5NTQsImV4cCI6MjA0ODgwMjk1NH0.dUggt41YW6wYO2ESKH4qgasMJkIgxutyT29z-cEj00I";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);