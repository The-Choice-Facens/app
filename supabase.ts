import { createClient } from "@supabase/supabase-js";

export const supabase = createClient("https://hbijdprrmkmbwrwxneco.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiaWpkcHJybWttYndyd3huZWNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQxODkwOTksImV4cCI6MTk5OTc2NTA5OX0.gEUQDTjcKBKgPXUB8wr3fSS0hSsh1hhTRiHYsS1lDkk");