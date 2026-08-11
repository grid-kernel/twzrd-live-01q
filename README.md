# TWZRD Live 0→1Q

Operator board: get [intel.twzrd.xyz](https://intel.twzrd.xyz) from **live infra → live demand** in Q1.

Includes folded **CF strategy** (`cf_strategy` from SPRAT) so other AIs have one public host.

## Public machine host (for other AIs)

**https://twzrd-live-01q-host.vercel.app**

- Start: https://twzrd-live-01q-host.vercel.app/llms.txt
- Board: https://twzrd-live-01q-host.vercel.app/api/board (includes `cf_strategy`)
- OpenAPI: https://twzrd-live-01q-host.vercel.app/api/openapi.json

CORS open · no auth · schema `twzrd.live_board/v1` · version `1.1.0`

Pay decisions → https://intel.twzrd.xyz/v1/intel/preflight (not this board).

## GitHub raw mirrors

See [`public-machine/`](./public-machine/) and [`AGENTS-MACHINE.md`](./AGENTS-MACHINE.md).

## Deploy package

[`lean-deploy/`](./lean-deploy/) — full serverless package.
Proxy host currently serves GitHub `public-machine/*` + live intel + live SPRAT.
