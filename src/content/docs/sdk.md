---
title: Python SDK
description: therminal-py — Python client for the Therminal API + live METAR signaling
---

## Install

```bash
pip install therminal-py            # core
pip install therminal-py[pandas]    # + DataFrame + Parquet support
pip install therminal-py[ml]        # + scikit-learn ML features
pip install therminal-py[torch]     # + PyTorch Dataset
pip install therminal-py[cli]       # + CLI tool
pip install therminal-py[all]       # pandas + ml + cli
```

Requires Python 3.11+. Current version: **v1.0.0**. Published on [PyPI](https://pypi.org/project/therminal-py/).

## What's new in v1.0.0

- **Domain-split modules**: `therminal.weather` (observations, climate) and `therminal.markets` (series, markets, candles, LOB)
- **LiveClient**: Real-time METAR from AWC (aviationweather.gov) with identical schema to historical data
- **Config file**: `~/.therminal.toml` with sensible defaults, env var overrides, per-call overrides
- **Typed models**: Frozen dataclasses for all return types (Observation, Candle, Market, etc.)
- Backward compatible: `from therminal import TherminalClient` still works

## Quick example

```python
from therminal.weather import WeatherClient, LiveClient
from therminal.markets import MarketsClient

# Historical data (via therminal-api)
weather = WeatherClient()
obs = weather.observations(station="NYC", units="metric", as_dataframe=True)

# Live METAR (direct from AWC — same schema as historical)
live = LiveClient()
current = live.current("NYC")
print(current[0].temp_f)  # attribute access
print(current[0]["temp_f"])  # dict access also works

# Batch: one AWC request for multiple stations
batch = live.current(["NYC", "ATL", "MDW"])

# Market data
markets = MarketsClient()
candles = markets.candles(market="KXHIGHNY-26MAR20-T50", from_date="2026-03-01")
```

### Backward-compatible usage

The `TherminalClient` facade still works exactly as before:

```python
from therminal import TherminalClient

client = TherminalClient()
candles = client.candles(market="KXHIGHNY-26MAR20-T50", from_date="2026-03-01")
obs = client.observations(station="NYC", units="metric", as_dataframe=True)
```

## Configuration

Create `~/.therminal.toml` to set defaults:

```toml
[defaults]
units = "metric"       # raw | metric | imperial
tz = "UTC"             # UTC | station | IANA name
station = "NYC"        # default station for weather calls

[api]
base_url = "https://api.mostlyright.xyz"
timeout = 30.0

[live]
timeout = 10.0
max_retries = 3
```

Resolution order (last wins):
1. Built-in defaults (`units="raw"`, `tz="UTC"`)
2. `~/.therminal.toml` (or `$THERMINAL_CONFIG` path)
3. Environment variables: `THERMINAL_UNITS`, `THERMINAL_TZ`, `THERMINAL_STATION`
4. Per-call keyword arguments

```python
from therminal.config import TherminalConfig

# Auto-loads from ~/.therminal.toml
config = TherminalConfig()

# Or explicit
config = TherminalConfig(units="metric", tz="America/New_York")

# Pass to any client
weather = WeatherClient(config=config)
live = LiveClient(config=config)
```

## Live METAR (AWC direct)

`LiveClient` fetches real-time METAR observations directly from the Aviation Weather Center. The returned `Observation` objects are schema-identical to what `WeatherClient.observations()` returns, so your training features and live signals use the same types.

```python
from therminal.weather import LiveClient

live = LiveClient()

# Latest observation for one station
obs = live.current("NYC")

# Batch: multiple stations in one request
obs = live.current(["NYC", "ATL", "MDW", "LAX"])

# Last 3 hours of observations
history = live.latest("NYC", hours=3)

# With unit conversion (same as API)
obs_metric = live.current("NYC", units="metric")
```

| Method | Description |
|--------|-------------|
| `current(station)` | Latest METAR. Accepts `str` or `list[str]` for batch. |
| `latest(station, hours=1)` | Recent observations (1-360 hours). |

Both methods accept optional `units` and `tz` overrides.

## Typed models

All API responses return frozen dataclasses with both attribute and dict-style access:

```python
obs = weather.observations(station="NYC")[0]

# Attribute access
print(obs.temp_f)
print(obs.station_code)

# Dict-style access (backward compatible)
print(obs["temp_f"])
print(obs.get("wind_speed_kt", 0))
print("raw_metar" in obs)

# Convert to dict
d = obs.to_dict()  # all 29 fields, None values included
```

Available models:
- `Observation` — METAR/SPECI weather data (29 fields)
- `Candle` — OHLCV market data
- `Market`, `Series` — market metadata
- `Climate` — daily high/low reports
- `LOBSnapshot`, `Level` — order book data

## Export formats

All data methods support `format` and `columns`:

```python
# Save as CSV with specific columns
path = weather.observations(
    station="NYC",
    from_date="2024-01-01",
    to_date="2024-12-31",
    format="csv",
    columns=["observed_at", "temp_f", "wind_speed_kt"],
    save_path="nyc_2024.csv",
)

# Save as Parquet
path = markets.candles(
    market="KXHIGHNY-26MAR20-T50",
    format="parquet",
    save_path="candles.parquet",
)

# Parquet directly into DataFrame
df = weather.observations(station="NYC", format="parquet", as_dataframe=True)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `format` | str | `None` (JSON default), `"csv"`, `"parquet"` |
| `columns` | list | Column names to include (e.g., `["temp_f", "wind_speed_kt"]`) |
| `save_path` | str/Path | File path for CSV/Parquet output |
| `as_dataframe` | bool | Return Pandas DataFrame (JSON or load saved Parquet) |

## CLI

```bash
therminal health
therminal series --limit 5
therminal candles KXHIGHNY-26MAR20-T50 --from 2026-03-01 --limit 10
therminal observations NYC --units metric
therminal observations LAX --resolution 1min
therminal climate NYC --from 2026-03-15 --to 2026-03-20
therminal lob KXHIGHNY-26MAR04-B51 --date 2026-03-01
```

## ML Features (scikit-learn)

`pip install therminal-py[ml]` adds `WeatherFeatures` — a scikit-learn `Transformer` that fetches weather data and engineers features for supervised learning.

```python
from therminal.ml import WeatherFeatures
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import GradientBoostingRegressor

pipe = make_pipeline(
    WeatherFeatures(station="ATL", sources=["omo", "metar"], lookback_hours=24),
    StandardScaler(),
    GradientBoostingRegressor(),
)
pipe.fit(dates_train, y_train)
pipe.predict(dates_test)
```

### Configuration

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `station` | str | `"ATL"` | Station code |
| `sources` | list | `["omo", "metar"]` | Data sources: `"omo"` (1-min ASOS), `"metar"` (hourly) |
| `lookback_hours` | int | `24` | Hours of data before each target date |
| `omo_aggs` | tuple | `("min","max","mean","std")` | Aggregations on OMO numeric fields |
| `metar_fields` | tuple | all available | METAR fields to include |
| `include_calendar` | bool | `True` | Day-of-year, month, weekday + cyclical encodings |
| `cache` | bool | `True` | Cache API responses locally (1h TTL) |

### LOB Features

```python
from therminal.ml import LOBFeatures
from sklearn.pipeline import make_pipeline
from sklearn.ensemble import GradientBoostingClassifier

pipe = make_pipeline(
    LOBFeatures(market="KXHIGHNY-26MAR04-B51", interval=60, levels=10),
    GradientBoostingClassifier(),
)
```

### PyTorch (optional)

```python
pip install therminal-py[torch]

from therminal.ml import TherminalDataset
import torch

ds = TherminalDataset(dates=dates, station="ATL", lookback_hours=24)
loader = torch.utils.data.DataLoader(ds, batch_size=32, shuffle=True)
```

## Error handling

```python
from therminal import NotFoundError, RateLimitError
from therminal.weather import WeatherClient
import time

weather = WeatherClient()

try:
    data = weather.observations(station="NONEXISTENT")
except NotFoundError:
    print("Station not found")
except RateLimitError as e:
    time.sleep(e.retry_after)
```

LiveClient maps AWC errors to the same exception types:
- AWC 429 → `RateLimitError`
- AWC 5xx → `ServerError` (retries automatically, max 3)
- Timeout → `TherminalError`
- Unknown station → empty list (not an error)

## Module reference

| Import | Class | Purpose |
|--------|-------|---------|
| `therminal.weather` | `WeatherClient` | Historical observations, climate, climate gaps |
| `therminal.weather` | `LiveClient` | Real-time METAR from AWC |
| `therminal.markets` | `MarketsClient` | Series, markets, candles, LOB |
| `therminal.config` | `TherminalConfig` | SDK configuration |
| `therminal.models` | `Observation`, `Candle`, `Market`, `Series`, `Climate`, `LOBSnapshot` | Typed data models |
| `therminal.ml` | `WeatherFeatures`, `LOBFeatures`, `TherminalDataset` | ML transformers |
| `therminal` | `TherminalClient` | Backward-compatible facade (composes Weather + Markets) |

## Links

- [PyPI package](https://pypi.org/project/therminal-py/)
- [GitHub repository](https://github.com/Tarabcak/therminal-py)
