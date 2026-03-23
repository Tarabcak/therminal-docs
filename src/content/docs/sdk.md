---
title: Python SDK
description: therminal-py — Python client for the Therminal API
---

## Install

```bash
pip install therminal-py            # core (returns dicts)
pip install therminal-py[pandas]    # + DataFrame + Parquet support
pip install therminal-py[ml]       # + scikit-learn ML features
pip install therminal-py[cli]       # + CLI tool
pip install therminal-py[all]       # pandas + ml + cli
```

Requires Python 3.10+. Current version: v0.3.0. Published on [PyPI](https://pypi.org/project/therminal-py/).

## Quick example

```python
from therminal import TherminalClient

client = TherminalClient()

# Get candles as JSON (list of dicts)
candles = client.candles(market="KXHIGHNY-26MAR20-T50", from_date="2026-03-01")

# As a Pandas DataFrame
df = client.candles(
    market="KXHIGHNY-26MAR20-T50",
    from_date="2026-03-01",
    as_dataframe=True,
)

# Weather observations in metric
obs = client.observations(station="NYC", units="metric", as_dataframe=True)

# 1-minute ASOS observations (v0.3.0+)
omo = client.observations(station="LAX", resolution="1min", as_dataframe=True)
```

## Export formats

All data methods (`candles`, `observations`, `climate`) support `format` and `columns`:

```python
# Save as CSV with specific columns
path = client.observations(
    station="NYC",
    from_date="2024-01-01",
    to_date="2024-12-31",
    format="csv",
    columns=["observed_at", "temp_f", "wind_speed_kt"],
    save_path="nyc_2024.csv",
)

# Save as Parquet
path = client.candles(
    market="KXHIGHNY-26MAR20-T50",
    format="parquet",
    save_path="candles.parquet",
)

# Parquet directly into DataFrame
df = client.observations(
    station="NYC",
    format="parquet",
    as_dataframe=True,
)
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
```

## ML Features (scikit-learn)

`pip install therminal-py[ml]` adds `WeatherFeatures` — a scikit-learn `Transformer` that fetches weather data and engineers features for supervised learning. Target variable (y) is your responsibility.

```python
from therminal.ml import WeatherFeatures
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import GradientBoostingRegressor

# Fits into any sklearn Pipeline, GridSearchCV, cross_val_score
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
| `metar_fields` | tuple | temp, dewpoint, humidity, wind, pressure, visibility | METAR fields to include |
| `include_calendar` | bool | `True` | Day-of-year, month, weekday + cyclical sin/cos encodings |
| `cache` | bool | `True` | Cache API responses locally (1h TTL) |

### Feature introspection

```python
wf = WeatherFeatures(station="ATL", sources=["omo"], lookback_hours=48)
wf.fit(dates)
wf.get_feature_names_out()
# → ['day_of_year', 'day_of_year_cos', 'day_of_year_sin', 'month', 'month_cos',
#    'month_sin', 'omo_count_48h', 'omo_dewpoint_c_max_48h', 'omo_temp_c_mean_48h', ...]
```

### PyTorch (optional)

```bash
pip install therminal-py[torch]
```

```python
from therminal.ml import TherminalDataset
import torch

ds = TherminalDataset(dates=dates, station="ATL", lookback_hours=24)
loader = torch.utils.data.DataLoader(ds, batch_size=32, shuffle=True)
```

## Error handling

```python
from therminal import TherminalClient, NotFoundError, RateLimitError
import time

client = TherminalClient()

try:
    data = client.series_detail("NONEXISTENT")
except NotFoundError:
    print("Not found")
except RateLimitError as e:
    time.sleep(e.retry_after)
```

## Links

- [PyPI package](https://pypi.org/project/therminal-py/)
- [GitHub repository](https://github.com/Tarabcak/therminal-py)
