---
title: Changelog
description: API version history
---

## v1.0.0 — 2026-03-20

Initial public release.

### Endpoints
- `GET /health` — API health check
- `GET /api/v1/series` — List and retrieve event series
- `GET /api/v1/markets` — List and retrieve prediction markets
- `GET /api/v1/candles` — OHLCV candlestick data with forward-fill and aggregation
- `GET /api/v1/observations` — Weather observations (METAR/SPECI)
- `GET /api/v1/climate` — Daily climate reports
- `GET /api/v1/analysis/climate-gaps` — Climate report gap analysis
- `GET /api/v1/download/observations` — Bulk observation parquet download
- `GET /api/v1/download/candles` — Bulk candle parquet download
- `GET /api/v1/download/climate` — Bulk climate parquet download

### Features
- Hot/cold query routing (Supabase 14-day cache + DuckDB historical parquets)
- Forward-fill sparse candle data
- Candle aggregation (1min → hourly, daily)
- Unit conversion (`?units=raw|metric|imperial`)
- Timezone conversion (`?tz=UTC|station|<IANA>`)
- Presigned R2 URLs for bulk parquet downloads
- Per-IP rate limiting (100 req/s)

### Python SDK
- `therminal-py` v0.1.0 published on PyPI
- All endpoints wrapped with optional DataFrame support
- CLI tool included (`pip install therminal-py[cli]`)
