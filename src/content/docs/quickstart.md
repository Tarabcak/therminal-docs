---
title: Quickstart
description: Get data from the Therminal API in under a minute
---

No API key required. The API is public and read-only.

## Check the API is up

```bash
curl https://api.mostlyright.xyz/health
```

```json
{"status":"ok","duckdb":"ok","supabase":"ok","sync":{"last_sync":"2026-03-20T16:20:24Z","file_count":548,"is_stale":false}}
```

## Get recent candles for a market

```bash
curl "https://api.mostlyright.xyz/api/v1/candles?market=KXHIGHNY-26MAR20-T50&interval=1&fill=false&limit=5"
```

## Get NYC weather observations in metric

```bash
curl "https://api.mostlyright.xyz/api/v1/observations?station=NYC&units=metric&limit=3"
```

## Get 1-minute ASOS observations

```bash
curl "https://api.mostlyright.xyz/api/v1/observations?station=LAX&resolution=1min&limit=3"
```

## Get daily climate reports

```bash
curl "https://api.mostlyright.xyz/api/v1/climate?station=NYC&from=2026-03-15&to=2026-03-20"
```

## Download a parquet file

```bash
# Get a presigned URL
curl "https://api.mostlyright.xyz/api/v1/download/observations?station=NYC&year=2024"

# Response contains a 5-minute presigned R2 URL — download it directly
```

## Using the Python SDK

```bash
pip install therminal-py
```

```python
from therminal.weather import WeatherClient, LiveClient
from therminal.markets import MarketsClient

# Historical data (via API)
weather = WeatherClient()
obs = weather.observations(station="NYC", units="metric")

# Live METAR (direct from AWC — same schema as historical)
live = LiveClient()
current = live.current(["NYC", "ATL", "MDW"])

# Market data
markets = MarketsClient()
candles = markets.candles(market="KXHIGHNY-26MAR20-T50", from_date="2026-03-01")
```

`from therminal import TherminalClient` still works for backward compatibility.

See the [Python SDK](/sdk) page for full documentation.
