import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <main className="grid min-h-dvh place-items-center bg-bg px-4 text-fg">
      <div className="panel w-full max-w-sm space-y-5 p-6">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-subtle">
            TWZRD Intel
          </p>
          <h1 className="text-xl font-semibold tracking-tight">Sign in</h1>
          <p className="text-sm text-muted">
            Optional — the Live 0→1Q board works without an account. Progress
            saves in this browser.
          </p>
        </div>
        {authEnabled ? (
          <div className="space-y-2">
            {GROK_PROVIDERS.map((p) => (
              <button
                key={p.providerId}
                type="button"
                onClick={() => signIn(p.providerId, { callbackURL: "/" })}
                className="flex h-11 w-full items-center justify-center rounded-md border border-border bg-surface-2 text-sm font-medium text-fg transition-colors hover:border-border-strong hover:bg-surface-3"
              >
                Continue with {p.label}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">Sign-in is disabled.</p>
        )}
        <Link
          to="/"
          className="block text-center text-sm text-muted underline-offset-4 hover:text-fg hover:underline"
        >
          Back to Live 0→1Q
        </Link>
      </div>
    </main>
  );
}
