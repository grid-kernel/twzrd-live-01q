# TWZRD Live 0→1Q

Operator board: get [intel.twzrd.xyz](https://intel.twzrd.xyz) from **live infra → live demand** in Q1.

## Humans
Open the deployed UI (Vercel project `twzrd-01q-live` / `twzrd-01q-board`).

## Agents (machine-readable)
Start at **`/llms.txt`** or the public snapshots in [`public-machine/`](./public-machine/).

| Endpoint | Purpose |
|---|---|
| `/llms.txt` | Agent markdown guide |
| `/api/board` | Full board snapshot (JSON) |
| `/api/board/status` | Live status + next actions |
| `/api/board/moves` | Playbook moves |
| `/api/openapi.json` | OpenAPI 3.1 |

Always-public raw:
`https://raw.githubusercontent.com/grid-kernel/twzrd-live-01q/main/public-machine/llms.txt`

## Deploy package
[`lean-deploy/`](./lean-deploy/) — zero-dependency Vercel serverless APIs + static UI.
