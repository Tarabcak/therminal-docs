---
title: Changelog
description: API version history
---

## v1.1.0 — 2026-03-20

### Downloads rework
- **`?format=json|csv|parquet`** on all data endpoints (candles, observations, climate)
- **`?columns=col1,col2`** for column selection in CSV/Parquet output
- Removed old `/api/v1/download/*` presigned URL endpoints
- CSV streams with `Content-Disposition` header for browser download
- Parquet uses Zstd compression

### Documentation
- Added interactive API playground on every endpoint page
- Added Data Sources page with full provenance details
- Added `llms.txt` for AI agent integration
- Replaced splash homepage with introduction
- Fixed playground field alignment and prev/next button sizing

### Python SDK v0.2.0
- Added `format` and `columns` params to `candles()`, `observations()`, `climate()`
- Removed `download_parquet()` (use `format="parquet"` instead)

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
