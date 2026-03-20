---
title: Python SDK
description: therminal-py — Python client for the Therminal API
---

## Install

```bash
pip install therminal-py            # core (returns dicts)
pip install therminal-py[pandas]    # + DataFrame support
pip install therminal-py[cli]       # + CLI tool
```

Requires Python 3.10+. Published on [PyPI](https://pypi.org/project/therminal-py/).

## Quick example

```python
from therminal import TherminalClient

client = TherminalClient()

# Get candles as dicts
candles = client.candles(market="KXHIGHNY-26MAR20-T50", from_date="2026-03-01")

# Or as a Pandas DataFrame (requires therminal-py[pandas])
df = client.candles(
    market="KXHIGHNY-26MAR20-T50",
    from_date="2026-03-01",
    as_dataframe=True,
)

# Weather observations in metric
obs = client.observations(station="NYC", units="metric", as_dataframe=True)

# Download bulk parquet
path = client.download_parquet("observations", station="NYC", year=2024)
df = client.download_parquet("observations", station="NYC", year=2024, load=True)
```

## CLI

```bash
therminal health
therminal series --limit 5
therminal candles KXHIGHNY-26MAR20-T50 --from 2026-03-01 --limit 10
therminal observations NYC --units metric
therminal climate NYC --from 2026-03-15 --to 2026-03-20
```

## Links

- [PyPI package](https://pypi.org/project/therminal-py/)
- [GitHub repository](https://github.com/Tarabcak/therminal-py)
