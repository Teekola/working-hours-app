import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
   server: {
      DATABASE_URL: z.string().url(),
      DIRECT_DATABASE_URL: z.string().url(),
   },
   client: {
      NEXT_PUBLIC_SUPABASE_URL: z.string().min(1),
      NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
      NEXT_PUBLIC_SITE_URL: z.string().min(1),
   },
   experimental__runtimeEnv: {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
   },
});
