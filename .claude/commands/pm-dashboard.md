# PM Dashboard

Deploy or update the project management dashboard plugin and sync the master AI data.

## What this does

1. Ensures `/plugins/project-management/` exists with all required files
2. Updates `master-ai-data.json` if KPIs or project data has changed
3. Verifies the dashboard widget is wired into `index.html`
4. Confirms `chatbot.js` is syncing from the master JSON

## Steps

Check that all plugin files exist:
- `plugins/project-management/master-ai-data.json`
- `plugins/project-management/pm-dashboard.js`
- `plugins/project-management/pm-dashboard.css`

If any are missing, recreate them from the latest portfolio data.

Then verify `index.html` includes:
- `<link rel="stylesheet" href="plugins/project-management/pm-dashboard.css">`
- `<script src="plugins/project-management/pm-dashboard.js"></script>`
- The `#pm-dashboard-widget` container inside a section with id `pm-dashboard`

Then verify `chatbot.js` loads from `MASTER_AI_DATA_PATH` first.

Report the status of each check and fix anything missing. Commit and push any changes made.
