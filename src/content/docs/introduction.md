---
title: Introduction
description: Therminal API — Kalshi temperature prediction markets + NWS weather data
---

**Therminal** provides programmatic access to Kalshi temperature prediction market data and NWS weather observations through a unified REST API.

## What's available

- **OHLCV Candles** — 1-minute candlestick data for all Kalshi temperature markets since 2021
- **Weather Observations** — Hourly METAR + SPECI data for 20 US stations since 2000
- **Daily Climate Reports** — NWS CLI high/low temperature reports since 2002
- **Parquet Downloads** — Bulk historical data via presigned Cloudflare R2 URLs

## Base URL

```
https://api.mostlyright.xyz
```

All endpoints return JSON. All timestamps are UTC unless a `tz` parameter is specified.

## Key concepts

| Concept | Description |
|---------|-------------|
| **Series** | A temperature metric for a location (e.g., `KXHIGHNY` = NYC daily high) |
| **Event** | A specific date's prediction (e.g., `KXHIGHNY-26MAR20` = NYC high on March 20) |
| **Market** | A strike within an event (e.g., `KXHIGHNY-26MAR20-T50` = "Will NYC high exceed 50°F?") |
| **Candle** | OHLCV price data at 1-minute intervals. Prices are in cents (0–100). |
| **Station** | A 3–4 letter NWS weather station code (e.g., `NYC`, `LAX`, `ORD`) |

## Data freshness

| Dataset | Latency | Source |
|---------|---------|--------|
| Candles (recent 14 days) | ~5 minutes | Kalshi API → Supabase |
| Candles (historical) | ~1 hour | R2 parquets via DuckDB |
| Observations (recent 14 days) | ~5 seconds | AWC → Supabase |
| Observations (historical) | ~1 hour | R2 parquets via DuckDB |
| Climate reports | ~24 hours | IEM → Supabase |
