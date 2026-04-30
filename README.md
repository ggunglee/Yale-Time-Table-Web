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

The copied `storage/*.json` files are bundled with the deploy and work as the initial cache.
Runtime updates from the Refresh buttons write to local files on the server. On Render free web
services, those runtime file changes may be lost after redeploys or restarts. For permanent shared
updates, add a Render Disk or move the cache to a database/storage service later.
