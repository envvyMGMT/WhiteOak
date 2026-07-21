# Blackbeam OS — Build Plan (demo shell → real product)

This turns the current static demo (`/os/`) into a real, multi-tenant SaaS
that other contractors can pay to use. It's written so you can hand any phase
to a developer (or Eli) and they'll know exactly what to build.

---

## Where we are today
- **Frontend:** a polished static app shell (vanilla HTML/CSS/JS) with mock data.
- **Automations:** a plug-in registry (`os/automations.js`) that the UI already
  calls via `engine.run(id, ctx)` — but the `run()` functions return **fake**
  output. This is the seam where the real AI drops in.
- **No** accounts, database, payments, or real messaging yet.

The UI is ~80% of a real product's screens. The gap is everything behind it.

---

## Recommended stack (fastest credible path)
You already have **Supabase** connected to this workspace, and it's the shortest
route to a real backend for a solo/small team:

| Layer | Choice | Why |
|------|--------|-----|
| Database | **Supabase Postgres** | Real relational data + Row-Level Security for multi-tenant isolation |
| Auth | **Supabase Auth** | Email/password + Google login out of the box |
| Multi-tenancy | **Postgres RLS + `org_id`** | Each contractor's data is walled off automatically |
| File storage | **Supabase Storage** | Job photos, quote PDFs |
| Background jobs / AI | **Supabase Edge Functions** (or a small worker) | Runs automations, calls the LLM, hits integrations |
| AI model | **Claude API (Anthropic)** | Drafting quotes, replying to leads, summaries — see `claude-api` |
| Payments | **Stripe** | Two jobs: (a) pay-links on *your customers'* invoices, (b) billing *contractors* for the OS subscription |
| SMS | **Twilio** | Instant replies + text follow-ups |
| Email | **Resend** or **SendGrid** | Quotes, invoices, sequences |
| Calendar | **Google Calendar API** | Crew scheduling sync |
| Frontend | Keep the **vanilla shell** for MVP; migrate to **Next.js/React** if/when it grows | Don't rewrite until data-binding pain justifies it |

> The current mock files map 1:1 to future tables: `data.js` → `leads`, `quotes`,
> `jobs`, `invoices`, `followups`; `automations.js` → an `automations` config table
> per org.

---

## Data model (first pass)
```
orgs            (id, name, trade, service_area, license_no, ai_tone, plan, created_at)
users           (id, org_id, email, name, role)              -- role: owner|crew
leads           (id, org_id, name, phone, email, source, job, location, status, value, created_at)
quotes          (id, org_id, lead_id, line_items jsonb, amount, status, ai_drafted, sent_at)
jobs            (id, org_id, quote_id, title, stage, crew[], start_date, progress)
invoices        (id, org_id, job_id, amount, status, due_date, pay_link, chased)
followups       (id, org_id, subject_id, channel, sequence, run_at, status, automated)
automations     (id, org_id, key, enabled, config jsonb)     -- one row per automation per org
automation_runs (id, org_id, automation_key, input jsonb, output jsonb, ok, created_at)
```
Every table gets an RLS policy: `org_id = auth.jwt() -> org_id`.

---

## How the AI (Eli) plugs in
The frontend never changes. A real automation replaces a mock like this:

```js
BlackbeamAutomations.register({
  id: 'instant-reply',
  status: 'active',
  async run(ctx) {
    // Edge Function → Claude drafts the reply → Twilio sends it → log the run
    const res = await fetch('/functions/v1/automations/instant-reply', {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify(ctx),
    }).then(r => r.json());
    return { ok: res.ok, summary: res.summary, output: res.message };
  },
});
```

Server side, each automation is an Edge Function that: (1) loads the org's
config + tone, (2) calls Claude for the language, (3) fires the integration
(Twilio/Resend/Stripe), (4) writes an `automation_runs` row (which is what the
Engine Log and activity feed will read from — no more mock data).

---

## Roadmap (dogfood first, then sell)

**Phase 1 — Make it real for *your own* crew (2–4 wks)**
- Supabase project, schema + RLS, Auth (just you).
- Wire Dashboard/Leads/Quotes to live data (replace `data.js` reads with queries).
- Ship **one** real automation end-to-end: **Instant Reply** (lead form → Claude → Twilio SMS).
- Point the marketing site's quote form at this so leads land *in the OS*.

**Phase 2 — The money loop (2–3 wks)**
- Real Quotes (Claude drafts line items → you approve → email/PDF).
- Invoices + **Stripe pay-links**; the Invoice Chaser automation.
- Follow-up sequences on a schedule (cron/Edge Function).

**Phase 3 — Multi-tenant + sellable (3–5 wks)**
- Org signup + onboarding wizard, per-org settings/tone.
- **Stripe Billing** for the OS subscription (this is how you get paid).
- Team invites, roles, basic support inbox.
- Onboard your first 1–2 external contractors.

**Phase 4 — Scale**
- Remaining automations (scheduling, reviews, call summaries, material orders).
- Client-facing portal (homeowners see quote/invoice/status).
- Reporting, integrations marketplace, mobile-friendly PWA.

---

## Don't-skip list (legal/ops — get a professional)
- **Privacy policy + Terms of Service** — you'll hold other businesses' customer data.
- **Data Processing Agreement** with each contractor customer.
- **Stripe** handles card data (PCI) — never store cards yourself.
- **Backups** + a data-export path (Postgres makes this easy).
- SMS compliance (opt-out handling / TCPA) — Twilio has guidance; confirm with counsel.

---

## Rough order-of-magnitude
- Solo builder using Supabase + Claude: **Phase 1 in a few weeks**, a sellable
  multi-tenant v1 in **~2–3 months** of focused work.
- Monthly running cost at low volume is small (Supabase free/pro, Twilio/Resend
  usage-based, Claude usage-based, Stripe % of revenue).

---

## Immediate next step
Dogfood Phase 1. The single highest-leverage build is **lead form → Claude →
instant SMS reply**, running on your own jobs. That one loop is the entire pitch
("five-minute replies") made real — and it becomes your first case study.
