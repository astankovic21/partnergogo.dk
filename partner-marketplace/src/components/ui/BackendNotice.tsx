import { AlertTriangle } from "lucide-react";

// Shown on real-backend-gated pages/forms when Supabase env vars aren't
// configured, instead of crashing. See src/lib/supabase/env.ts.
export default function BackendNotice({
  message = "Backend not configured yet. Set the Supabase environment variables (see .env.example) to enable this.",
}: {
  message?: string;
}) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
