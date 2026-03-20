---
title: Access
description: API access and planned access control
---

:::note
The Therminal API is currently **public and read-only**. No credentials are required.
:::

All endpoints are open. Simply make HTTP GET requests to `https://api.mostlyright.xyz`.

## Planned access control

A future release will add optional access management:

- Per-user API access via issued credentials
- Configurable per-user rate limits
- Usage tracking and analytics

The current rate limit of 100 requests/second per IP applies to all callers. See [Rate Limits & Errors](/errors/) for details.
