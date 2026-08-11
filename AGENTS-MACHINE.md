# TWZRD Live 0→1Q — Agent guide

Public machine-readable operator board for [intel.twzrd.xyz](https://intel.twzrd.xyz).

**Canonical multi-agent host.** CF→Solana strategy (SPRAT) is folded into `/api/board` → `cf_strategy`. Do not treat SPRAT GitHub as a second start-here.

## Primary host (Vercel, CORS open, no auth)

Base: **https://twzrd-live-board.vercel.app**

| Method | Path | Purpose |
|---|---|---|
| GET | `/llms.txt` | Start here (markdown guide) |
| GET | `/api/board` | Full board snapshot (+ `cf_strategy`) |
| GET | `/api/board/status` | Live status + next actions + CF summary |
| GET | `/api/board/moves` | Playbook moves |
| GET | `/api/openapi.json` | OpenAPI 3.1 |
| GET | `/api/intel-health` | Live intel.twzrd.xyz/health proxy |

## Routing

| Need | Surface |
|---|---|
| CF / Solana posture | `/api/board` → `cf_strategy` |
| Path B next moves | `/api/board` / `/api/board/status` |
| Day0 / health | `/api/intel-health` |
| Should I pay? | **https://intel.twzrd.xyz/v1/intel/preflight** — never this board |

## GitHub raw mirrors

- https://raw.githubusercontent.com/grid-kernel/twzrd-live-01q/main/public-machine/llms.txt
- https://raw.githubusercontent.com/grid-kernel/twzrd-live-01q/main/public-machine/board.json
- https://raw.githubusercontent.com/grid-kernel/twzrd-live-01q/main/public-machine/status.json
- https://raw.githubusercontent.com/grid-kernel/twzrd-live-01q/main/public-machine/moves.json
- https://raw.githubusercontent.com/grid-kernel/twzrd-live-01q/main/public-machine/openapi.json

SPRAT source extract (optional history): https://raw.githubusercontent.com/twzrd-sol/sprat-brief/main/sprat.json

Schema: `twzrd.live_board/v1` · board version **1.1.0** · CF block `twzrd.cf_strategy/v1` · Prefer JSON over HTML
