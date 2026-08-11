# TWZRD Live 0→1Q — Agent guide

Public machine-readable operator board for [intel.twzrd.xyz](https://intel.twzrd.xyz).

## Primary host (Vercel, CORS open, no auth)

Base: **https://twzrd-live-board.vercel.app**

| Method | Path | Purpose |
|---|---|---|
| GET | `/llms.txt` | Start here (markdown guide) |
| GET | `/api/board` | Full board snapshot |
| GET | `/api/board/status` | Live status + next actions |
| GET | `/api/board/moves` | Playbook moves |
| GET | `/api/openapi.json` | OpenAPI 3.1 |
| GET | `/api/intel-health` | Live intel.twzrd.xyz/health proxy |

Aliases: `/board.json`, `/status.json`, `/moves.json`, `/openapi.json`

## GitHub raw mirrors

- https://raw.githubusercontent.com/grid-kernel/twzrd-live-01q/main/public-machine/llms.txt
- https://raw.githubusercontent.com/grid-kernel/twzrd-live-01q/main/public-machine/board.json
- https://raw.githubusercontent.com/grid-kernel/twzrd-live-01q/main/public-machine/status.json
- https://raw.githubusercontent.com/grid-kernel/twzrd-live-01q/main/public-machine/moves.json
- https://raw.githubusercontent.com/grid-kernel/twzrd-live-01q/main/public-machine/openapi.json

Schema: `twzrd.live_board/v1` · Prefer JSON over HTML
