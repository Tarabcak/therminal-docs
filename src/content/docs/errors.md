---
title: Rate Limits & Errors
description: Rate limiting, error codes, and retry behavior
---

## Rate limits

| Limit | Value |
|-------|-------|
| Requests per second (per IP) | 100 |
| Burst | 20 |
| Retry-After header | Yes (on 429) |

Rate limits are applied per source IP address. There is no authentication-based rate limiting (all callers share the same per-IP bucket).

When rate limited, the API returns a `429` response with a `Retry-After` header indicating how many seconds to wait.

## Error format

All errors return JSON:

```json
{
  "error": "human-readable error message"
}
```

## Status codes

| Code | Meaning | When |
|------|---------|------|
| `200` | Success | Request completed normally |
| `400` | Bad Request | Invalid parameters (bad date format, invalid interval, etc.) |
| `401` | Unauthorized | Authentication required (future) |
| `403` | Forbidden | Access denied (future) |
| `404` | Not Found | Resource does not exist (wrong ticker, etc.) |
| `429` | Too Many Requests | Rate limit exceeded. Check `Retry-After` header |
| `500` | Internal Server Error | Server-side failure |

## Python SDK error handling

```python
from therminal import TherminalClient, NotFoundError, RateLimitError
import time

client = TherminalClient()

try:
    series = client.series_detail("NONEXISTENT")
except NotFoundError:
    print("Series not found")
except RateLimitError as e:
    print(f"Rate limited. Retry after {e.retry_after}s")
    time.sleep(e.retry_after)
```

### Exception hierarchy

| Exception | HTTP Code | Description |
|-----------|-----------|-------------|
| `TherminalError` | Any | Base exception |
| `NotFoundError` | 404 | Resource not found |
| `ValidationError` | 400 | Invalid request parameters |
| `RateLimitError` | 429 | Rate limit exceeded (`.retry_after` attribute) |
| `AuthenticationError` | 401 | Auth required (future) |
| `ForbiddenError` | 403 | Access denied (future) |
| `ServerError` | 5xx | Server-side error |
