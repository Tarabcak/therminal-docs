---
title: Changelog
description: API version history
---

## v1.2.0 — 2026-03-23

### 1-Minute ASOS Observations (OMO)
- **`?resolution=1min`** on `/api/v1/observations` returns 1-minute ASOS data from NCEI (DSI-6406)
- ~166M records, 2000–2026, 19 of 20 stations (NYC excluded — Central Park is not an airport ASOS)
- Response fields: `station_code`, `observed_at`, `temp_c`, `dewpoint_c`, `pressure1_inhg`, `pressure2_inhg`, `pressure3_inhg`, `precip_type`, `precip_in`
- `?units=` rejected with 400 for `resolution=1min` (temperatures always integer °C)
- `?type=` silently ignored for `resolution=1min`
- `?format=csv|parquet` and `?columns=` work normally

### NCEI CLI Backfill
- New report type **`ncei_final`** (priority 2.5) on `/api/v1/climate` — GHCN-Daily CF6 first-published values from NCEI superghcnd diffs
- Source tagged as `ncei`

### Python SDK v0.3.0
- Added `resolution` parameter to `observations()` — `resolution="1min"` for 1-minute ASOS data
- CLI: `therminal observations STATION --resolution 1min`

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
