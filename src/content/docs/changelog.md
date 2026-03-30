---
title: Changelog
description: API version history
---

## v1.4.0 — 2026-03-30

### Python SDK v1.0.3 — Ergonomics Rewrite

- **Domain-split modules**: `therminal.weather` (WeatherHistory, WeatherLive) and `therminal.markets` (MarketsClient)
- **Canonical names**: `WeatherClient` renamed to `WeatherHistory`, `LiveClient` renamed to `WeatherLive` (old names still work as aliases)
- **WeatherLive**: Real-time METAR from AWC (aviationweather.gov), direct fetch with identical Observation schema to historical data
  - Batch support: `live.current(["NYC", "ATL", "MDW"])` makes one AWC request
  - Go-matched rounding ensures training/inference parity
- **TherminalConfig**: `~/.therminal.toml` config file with 4-layer resolution (file < env vars < kwargs)
- **Typed models**: Frozen dataclasses (Observation, Candle, Market, Series, Climate, LOBSnapshot) with dict-style access for backward compat
- **DictLikeMixin**: `obs["temp_f"]`, `obs.get("temp_f")`, and `obs.temp_f` all work
- Python 3.11+ required (dropped 3.10)
- `TherminalClient` facade preserved for backward compatibility
- 184 tests, 80% coverage

---

## v1.3.0 — 2026-03-26

### Limit Order Book (LOB)
- **`GET /api/v1/lob`** — Reconstructed order book snapshots from Kalshi and Polymarket delta data
- Parameters: `market`, `series`, `source` (kalshi/polymarket), `date`/`from`/`to`, `interval` (1–3600s, default 60), `levels` (1–50, default 10)
- Supports JSON, CSV, Parquet, and NDJSON output formats
- Singleflight deduplication for identical concurrent requests
- 4 concurrent LOB requests max (semaphore-bounded)
- Result caps: 50K JSON, 500K CSV/Parquet/NDJSON

### NDJSON Format
- **`?format=ndjson`** now supported on candles, observations, and LOB endpoints
- Newline-delimited JSON — one object per line, streamable
- Same 500K row cap as CSV/Parquet
- No pagination, no forward-fill (returns raw sparse data like CSV)

### Python SDK v0.5.0
- `client.lob()` — LOB snapshots with full format support, DataFrame, save_path
- `LOBFeatures` sklearn transformer — spread, mid, imbalance, depth, weighted_mid, pressure features with lookback aggregation
- CLI: `therminal lob MARKET --date 2026-03-01 --interval 60`

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
