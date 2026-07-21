# Auto-Quote workflow (n8n)

Turns a website quote request into an AI-drafted quote, emailed to the
customer and logged into Blackbeam OS — automatically.

**Flow:** Website form → n8n webhook → Claude drafts quote → email customer + save lead to Supabase → respond.

## 1. Get n8n running
- Easiest: **n8n Cloud** (n8n.io → free trial). Or self-host with Docker:
  `docker run -it --rm -p 5678:5678 -v ~/.n8n:/home/node/.n8n docker.n8n.io/n8nio/n8n`

## 2. Import the workflow
- In n8n: **Workflows → Import from File** → pick `blackbeam-auto-quote.json`.

## 3. Set these environment variables (Settings → Variables, or host env)
| Var | Where to get it |
|-----|-----------------|
| `ANTHROPIC_API_KEY` | console.anthropic.com → API Keys |
| `SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `SUPABASE_SERVICE_KEY` | Supabase → Project Settings → API → **service_role** key (server-only!) |
| `BLACKBEAM_ORG_ID` | the `orgs.id` row for Blackbeam (created after you sign up) |
| `RESEND_API_KEY` | resend.com → API Keys (verify your sending domain) |

## 4. Get the webhook URL
- Open the **Quote Request** node → copy the **Production URL**
  (looks like `https://<you>.app.n8n.cloud/webhook/blackbeam-quote`).

## 5. Point the website form at it
In `index.html`, set the quote form's action to that URL:
```html
<form id="quoteForm" action="https://<you>.app.n8n.cloud/webhook/blackbeam-quote" method="POST">
```
The site's existing AJAX handler already posts the form fields (name, phone,
email, service, details) and shows the success message on a 200 response.

## 6. Test before going live
- In n8n, click **Test workflow**, then submit your real site form (or use the
  node's "Listen for test event").
- Watch each node's output. Tune the Claude **system prompt** (in the *Claude —
  Draft Quote* node) to match your pricing and voice.
- **Recommended:** keep quotes as *drafts a human approves* rather than
  auto-sending — construction pricing sight-unseen is risky. To do that, remove
  the **Email Customer** node and instead review the draft in Blackbeam OS.

## Notes
- The workflow writes with the Supabase **service_role** key, which bypasses
  row-level security, so it sets `org_id` explicitly. Keep that key server-side
  only — never in the website or the OS frontend.
- Swap `claude-sonnet-5` for `claude-haiku-4-5` in the Claude node if you want
  cheaper/faster drafts.
