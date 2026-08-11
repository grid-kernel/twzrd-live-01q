# TWZRD Live 0→1Q

Operator board for getting [intel.twzrd.xyz](https://intel.twzrd.xyz) from **live infra** to **live demand** in Q1.

Humans use the UI. **Agents should not scrape HTML** — use the machine surfaces below.

## Machine entry (agents)

| Path | Purpose |
|---|---|
| `GET /llms.txt` | Agent guide + live diagnosis (markdown) |
| `GET /api/board` | Full board JSON (`twzrd.live_board/v1`) |
| `GET /api/board/status` | Compact live funnel + next actions |
| `GET /api/board/moves` | Playbook moves (filterable) |
| `GET /api/openapi.json` | OpenAPI 3.1 |
| `GET /api/intel-health` | Proxy of `intel.twzrd.xyz/health` |

CORS is open (`*`) on machine endpoints.

### Filters

```
/api/board/moves?phase=truth&horizon=this_week&impact=critical
/api/board?done=truth-external-only,wedge-path-b
```

### Schema

- `schema`: `twzrd.live_board/v1`
- North star: external **Path B** (`gate_evals`) before free MCP vanity metrics
- Live funnel: external free cards → gate evals → gate blocks → paid external trust

## Local

```bash
npm install
npm run dev   # 0.0.0.0:8080
```

## Product context

TWZRD is the pre-spend trust gate for Solana x402 agents. This board tracks the Q1 path to real installs of `twzrd-x402-gate` (refuse-before-sign), not more surface area on Intel.
