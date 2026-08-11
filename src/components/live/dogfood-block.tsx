import { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

const CMD = `npm i twzrd-x402-gate@0.8.14 x402-solana@2.1.0 @x402/core @x402/fetch @x402/svm @solana/kit @scure/base
node node_modules/twzrd-x402-gate/bin/twzrd-gate-eval-refuse.js
# Wanted: signer_invocation_count=0 payment_retry_count=0`;

export function DogfoodBlock() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(CMD);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="panel min-w-0 p-5 sm:p-6">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface-2">
            <Terminal className="h-4 w-4 text-fg" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-subtle">
              Path B dogfood
            </p>
            <h2 className="text-base font-semibold tracking-tight">
              Cold-machine refuse proof
            </h2>
            <p className="mt-1 text-sm text-muted">
              No wallet. No USDC. Success is a refuse before any signer runs.
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={copy}
          className="shrink-0"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-ok" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </>
          )}
        </Button>
      </div>
      <pre className="mt-4 max-w-full overflow-x-auto whitespace-pre-wrap break-all rounded-xl border border-border bg-bg p-4 font-mono text-[12px] leading-relaxed text-fg/90 sm:break-normal sm:whitespace-pre sm:text-[13px]">
        {CMD}
      </pre>
    </section>
  );
}
