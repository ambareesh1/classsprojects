# Connect quote requests to Google Sheets

Target: https://docs.google.com/spreadsheets/d/18Zr7fzVQluB5rJWnpqRP6NNdUWJfK-ejELH_9nyot8U/edit

The website sends requests through `/api/quote` on Vercel. It shows success only after Google confirms the row was saved. A new **Quote Requests** tab is created automatically; existing tabs are left intact. Delivery city can be included in the requirement field.

## One-time Google setup (Sheet owner)

1. Open the Sheet, then **Extensions → Apps Script**.
2. Replace the editor contents with `Code.gs` in this folder and save.
3. In **Project Settings → Script properties**, add `QUOTE_WEBHOOK_TOKEN` with a long random secret (at least 32 characters). Keep it private; do not commit it to GitHub or send it in chat.
4. Select **Deploy → New deployment → Web app**. Set **Execute as: Me**, **Who has access: Anyone**. Authorize the script from your own Google account. If your Workspace policy does not allow this access setting, your administrator must enable it or you need another integration.
5. Copy the deployed Web app URL ending in `/exec` (not `/dev`).

## Vercel setup

In the Vercel project's **Settings → Environment Variables**, add these to Production (and Preview if you want preview submissions):

| Name | Value |
| --- | --- |
| `GOOGLE_SHEETS_WEBHOOK_URL` | The deployed Apps Script `/exec` URL |
| `GOOGLE_SHEETS_WEBHOOK_TOKEN` | The same secret entered in Apps Script |

Redeploy the Vercel project. No Sheet sharing with the public is needed. These values stay on the server; do not add them to `dist/config.js`.

## Verify

Submit one clearly labeled test enquiry on the Vercel site. Confirm the success message and matching row in **Quote Requests**. Check that a phone beginning with `+91` is stored as text. Retry with the same details after a network error; the request ID prevents duplicate rows for that retry. Changing the enquiry after an error starts a new request. Google permissions, quotas, and Vercel configuration must all be working for real delivery; this repository does not deploy Apps Script automatically.

For a code change in Apps Script, use **Deploy → Manage deployments → Edit → New version** and deploy again.

The public website endpoint includes validation and a honeypot. For higher traffic, configure rate limiting/bot protection in Vercel; there is no distributed rate limiter in this temporary version.
