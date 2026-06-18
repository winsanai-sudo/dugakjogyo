import { createClient } from "@supabase/supabase-js";
import { requireEnv } from "./env";

export type ApplicationRow = {
  id: string;
  name: string;
  phone: string;
  school: string;
  birth_year: string;
  address: string;
  introduction: string;
  mbti: string;
  resume_path: string;
  original_file_name: string;
  solution_path: string;
  original_solution_file_name: string;
  created_at: string;
};

export function getSupabaseAdmin() {
  return createClient(requireEnv("SUPABASE_URL"), requireEnv("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
