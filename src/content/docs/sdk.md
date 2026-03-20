---
title: Python SDK
description: therminal-py — Python client for the Therminal API
---

## Install

```bash
pip install therminal-py            # core (returns dicts)
pip install therminal-py[pandas]    # + DataFrame + Parquet support
pip install therminal-py[cli]       # + CLI tool
```

Requires Python 3.10+. Published on [PyPI](https://pypi.org/project/therminal-py/).

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
therminal climate NYC --from 2026-03-15 --to 2026-03-20
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
