---
title: Data Sources
description: Where Therminal data comes from — sources, coverage, and quality
---

## Candle Data (OHLCV)

| Source | Coverage | Latency | Notes |
|--------|----------|---------|-------|
| [Kalshi API](https://docs.kalshi.com) | 2021–present | ~5 minutes | 1-minute candlesticks for all temperature markets |

Candles are polled every 5 minutes from the Kalshi public API. Only candles with actual trades are stored (sparse storage). Forward-fill is applied at query time to create continuous time series.

Kalshi temperature markets cover daily high and low temperatures for 20 US cities. Markets open approximately 10:00 AM ET the day before the weather date and close at 11:59 PM ET on the weather date. Prices are in cents (0–100 range for binary contracts).

## Weather Observations (METAR/SPECI)

| Source | Type | Coverage | Latency | Notes |
|--------|------|----------|---------|-------|
| [AWC](https://aviationweather.gov) | Live METAR + SPECI | Last 15 days | 2–6 minutes | Primary live source. Polled every 5 seconds. |
| [IEM](https://mesonet.agron.iastate.edu) | Historical METAR + SPECI | 2000–present | Hours–days | Iowa Environmental Mesonet. Primary historical archive. |
| [NOAA ISD](https://www.ncei.noaa.gov/products/land-based-station/integrated-surface-database) | Historical METAR + SPECI | 1943–present | Days–months | Gap-fill fallback for missing IEM data. |

### Observation fields

30 fields including temperature, dewpoint, wind (speed/direction/gust), barometric pressure, visibility, sky cover (4 layers), weather codes, precipitation, peak wind, feels-like temperature, snow depth, and raw METAR text.

### Station list

20 NWS stations covering major US cities:

| Code | City | Timezone |
|------|------|----------|
| NYC | New York (Central Park) | America/New_York |
| LAX | Los Angeles | America/Los_Angeles |
| ORD | Chicago (O'Hare) | America/Chicago |
| MDW | Chicago (Midway) | America/Chicago |
| DEN | Denver | America/Denver |
| MIA | Miami | America/New_York |
| ATL | Atlanta | America/New_York |
| DFW | Dallas-Fort Worth | America/Chicago |
| HOU | Houston | America/Chicago |
| BOS | Boston | America/New_York |
| AUS | Austin | America/Chicago |
| LAS | Las Vegas | America/Los_Angeles |
| PHX | Phoenix | America/Phoenix |
| MSY | New Orleans | America/Chicago |
| SEA | Seattle | America/Los_Angeles |
| SFO | San Francisco | America/Los_Angeles |
| DCA | Washington DC | America/New_York |
| PHL | Philadelphia | America/New_York |
| PHI | Philadelphia (alt) | America/New_York |
| TPA | Tampa | America/New_York |

## Daily Climate Reports (CLI)

| Source | Report Types | Coverage | Notes |
|--------|-------------|----------|-------|
| [IEM](https://mesonet.agron.iastate.edu) | Final, Correction, Preliminary | ~2002–present | Official NWS CLI products |
| [ACIS](https://www.rcc-acis.org) | Estimated | 1930–present | GHCN-Daily derived. Gap filler only. |

### Report type priority

| Type | Priority | Description |
|------|----------|-------------|
| `final` | Highest (3) | Official daily report, issued next morning |
| `correction` | High (2) | Corrected report (rare) |
| `preliminary` | Medium (1) | Not used for Kalshi settlement |
| `estimated` | Lowest (0) | ACIS-derived from GHCN-Daily. Tagged `source: acis`. Never overwrites real reports. |

### Settlement rules

Kalshi uses the **first non-preliminary CLI report** for market settlement. If a final report says the NYC high was 52°F, the "Will NYC high exceed 50°F?" market settles YES.

Post-settlement corrections are tracked but do not change the settlement outcome.

### Known gaps

Some stations have historical gaps in CLI report coverage. Use the [climate gaps analysis endpoint](/api/analysis/) to identify missing dates for any station.
