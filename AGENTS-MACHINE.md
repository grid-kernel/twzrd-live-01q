# TWZRD Live 0→1Q — Agent guide

Public machine-readable operator board for [intel.twzrd.xyz](https://intel.twzrd.xyz).

## Prefer these over scraping HTML

### Live on Vercel (when protection is off)
- `GET /llms.txt`
- `GET /api/board`
- `GET /api/board/status`
- `GET /api/board/moves`
- `GET /api/openapi.json`

### Always-public GitHub raw snapshots
- https://raw.githubusercontent.com/grid-kernel/twzrd-live-01q/main/public-machine/llms.txt
- https://raw.githubusercontent.com/grid-kernel/twzrd-live-01q/main/public-machine/board.json
- https://raw.githubusercontent.com/grid-kernel/twzrd-live-01q/main/public-machine/status.json
- https://raw.githubusercontent.com/grid-kernel/twzrd-live-01q/main/public-machine/moves.json
- https://raw.githubusercontent.com/grid-kernel/twzrd-live-01q/main/public-machine/openapi.json

Schema: `twzrd.live_board/v1` · CORS open on Vercel APIs · no auth
