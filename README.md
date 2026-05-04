# Yale Time Table Web

Render-ready web version of the Yale Time Table app.

## Local Run

```powershell
npm install
npm start
```

Then open:

```text
http://localhost:8420
```

## Render Deploy

1. Push this folder to a GitHub repository.
2. In Render, create a new Web Service from that repository.
3. Use:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Open the Render URL after the deploy finishes.

The app serves the frontend from `app/` and keeps the existing API paths under `/api/...`.

## Storage Note

The copied `storage/*.json` files are bundled with the deploy and work as the shared initial cache.
User plans and refresh results are saved in each browser's `localStorage`, so Render Free works
without a persistent disk and users do not see each other's saved schedules or local refreshes.

The server still supports `STORAGE_DIR`/`ENABLE_SERVER_CACHE_WRITES=1` for deployments that want a
shared persistent server cache, but it is intentionally off by default for free Render hosting.
