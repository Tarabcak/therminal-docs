# therminal-docs

API documentation for Therminal. Static site built with Astro Starlight, hosted on Cloudflare Pages.

## Stack
- Astro 6 + Starlight (static docs framework)
- Custom terminal/monospace theme (black & white, GitBook-calibrated)
- Cloudflare Pages (auto-deploy on push to main)

## URLs
- Production: `https://docs.mostlyright.xyz`
- llms.txt: `https://docs.mostlyright.xyz/llms.txt`

## Project Layout
```
src/content/docs/          # Markdown/MDX content pages
src/components/            # Custom Astro components (ApiPlayground, ThemeSelect)
src/styles/custom.css      # Terminal theme overrides
public/llms.txt            # LLM-readable API summary
astro.config.mjs           # Starlight config, sidebar, component overrides
```

## Commands
```bash
npm run dev                # Dev server (localhost:4321)
npx astro build            # Build to dist/
rm -rf dist .astro && npx astro build  # Clean build (if cache issues)
```

## Content Rules
- Every API endpoint page: params table, curl + Python examples, response example, "Try it" playground, data source reference
- Avoid words "authentication", "login", "password", "token" in URLs (Google Safe Browsing flags them)
- GitBook-calibrated font sizes: body 15px, code 13px, sidebar 13px, tables 13px
- When API changes: update endpoint page + changelog + llms.txt in same commit

## Deployment
- Push to main → Cloudflare Pages auto-builds and deploys
- Build: `npm run build`, output: `dist/`, deploy command: `echo done`
- Domain: `docs.mostlyright.xyz` CNAME on Cloudflare DNS
- If 0 pages built: delete `.astro/` directory (stale content cache)
