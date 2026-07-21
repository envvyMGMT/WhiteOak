/* ============================================================
   BLACKBEAM OS — Automation Engine (plug-in registry)
   ------------------------------------------------------------
   This is the seam where real AI automations plug in later.

   Each automation is a self-contained module implementing the
   AutomationModule interface below. The UI (app.js) never talks
   to an automation directly — it only reads this registry and
   calls engine.run(id, context). That means a real automation
   can replace a mock one WITHOUT any UI changes.

   ┌── AutomationModule ────────────────────────────────────────┐
   │ id        string   unique key (kebab-case)                 │
   │ name      string   display name                            │
   │ category  string   grouping label                          │
   │ icon      string   inline SVG (see ICONS in app.js)        │
   │ blurb     string   one-line description                    │
   │ status    string   'active' | 'available' | 'coming-soon'  │
   │ metric    {label,value}   headline stat for the card       │
   │ config    object   arbitrary settings (thresholds, tone…)  │
   │ run(ctx)  async ->  { ok, summary, detail, output }        │
   └────────────────────────────────────────────────────────────┘

   TO PLUG IN A REAL AUTOMATION (Eli):
     BlackbeamAutomations.register({
       id:'instant-reply', name:'Instant Reply', status:'active',
       async run(ctx){
         // INTEGRATION POINT — call the real service:
         const res = await fetch('/api/automations/instant-reply', {
           method:'POST', body: JSON.stringify(ctx)
         }).then(r=>r.json());
         return { ok:true, summary:res.summary, output:res.message };
       }
     });
   register() overrides any existing module with the same id, so
   these mock definitions are simply the default until replaced.
   ============================================================ */

(function () {
  const registry = new Map();

  // small helper so mock runs feel asynchronous / real
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  const engine = {
    /** Register or replace an automation module. */
    register(mod) {
      if (!mod || !mod.id) throw new Error('automation needs an id');
      const existing = registry.get(mod.id) || {};
      registry.set(mod.id, Object.assign({ status: 'available', config: {}, metric: null }, existing, mod));
      document.dispatchEvent(new CustomEvent('automations:changed', { detail: { id: mod.id } }));
      return registry.get(mod.id);
    },
    get(id) { return registry.get(id); },
    all() { return [...registry.values()]; },
    active() { return this.all().filter((a) => a.status === 'active'); },
    setStatus(id, status) {
      const m = registry.get(id); if (!m) return;
      m.status = status;
      document.dispatchEvent(new CustomEvent('automations:changed', { detail: { id } }));
    },
    /** Run an automation. Falls back to a mock if it has no run(). */
    async run(id, context = {}) {
      const m = registry.get(id);
      if (!m) return { ok: false, summary: 'Unknown automation' };
      if (m.status === 'coming-soon') return { ok: false, summary: `${m.name} isn't available yet.` };
      if (typeof m.run === 'function') return m.run(context);
      return { ok: true, summary: `${m.name} ran (stub).` };
    },
  };

  /* ---------------------------------------------------------------
     DEFAULT MOCK MODULES
     These simulate output so the shell is demo-able today. When the
     real engine is ready, register() the same ids to override them.
  --------------------------------------------------------------- */

  engine.register({
    id: 'instant-reply',
    name: 'Instant Reply',
    category: 'Lead response',
    icon: 'bolt',
    blurb: 'Answers every new inquiry in under a minute — texts and emails, day or night.',
    status: 'active',
    metric: { label: 'Avg response', value: '0:47' },
    config: { channels: ['SMS', 'Email'], businessHoursOnly: false, tone: 'Friendly-pro' },
    async run(ctx) {
      await wait(750);
      const who = ctx.name || 'the new lead';
      return {
        ok: true,
        summary: `Replied to ${who} in 0:41`,
        detail: 'Instant Reply · SMS',
        output:
          `Hi ${(ctx.name || 'there').split(' ')[0]}, thanks for reaching out to Blackbeam! ` +
          `We'd love to help with your ${ctx.job ? ctx.job.toLowerCase() : 'project'}. ` +
          `I can have a ballpark quote over to you today — what's the best address for the work, ` +
          `and is there a timeline you're aiming for? — Blackbeam`,
      };
    },
  });

  engine.register({
    id: 'instant-quote',
    name: 'Auto Quote',
    category: 'Estimating',
    icon: 'doc',
    blurb: 'Drafts a plain-English, line-item quote from the lead details for you to approve.',
    status: 'active',
    metric: { label: 'Avg draft time', value: '2.4 min' },
    config: { requireApproval: true, markup: 0.18, template: 'Standard' },
    async run(ctx) {
      await wait(1100);
      const amt = ctx.value || 18500;
      return {
        ok: true,
        summary: `Drafted quote — ${ctx.job || 'project'} · $${amt.toLocaleString()}`,
        detail: 'Auto Quote · pending your approval',
        output: `Line items generated (demolition, materials, labor, cleanup) with an 18% margin. Ready to review & send.`,
      };
    },
  });

  engine.register({
    id: 'follow-up',
    name: 'Follow-up Sequences',
    category: 'Nurture',
    icon: 'repeat',
    blurb: 'Chases unaccepted quotes and quiet leads on a smart cadence until they reply or close.',
    status: 'active',
    metric: { label: 'Recovered / mo', value: '$18.6k' },
    config: { maxTouches: 3, cadenceDays: [1, 3, 7], stopOnReply: true },
    async run(ctx) {
      await wait(650);
      return { ok: true, summary: `Follow-up scheduled — ${ctx.client || 'lead'}`, detail: 'Sequence · step 1/3' };
    },
  });

  engine.register({
    id: 'invoice-chaser',
    name: 'Invoice & Payment Chaser',
    category: 'Billing',
    icon: 'receipt',
    blurb: 'Sends invoices on job milestones and politely chases overdue balances automatically.',
    status: 'active',
    metric: { label: 'Days to paid', value: '−6.2' },
    config: { reminderDays: [3, 7, 14], attachPayLink: true },
    async run(ctx) {
      await wait(600);
      return { ok: true, summary: `Reminder queued — invoice ${ctx.id || ''}`, detail: 'Billing · with pay link' };
    },
  });

  engine.register({
    id: 'scheduling',
    name: 'Smart Scheduling',
    category: 'Operations',
    icon: 'calendar',
    blurb: 'Slots accepted jobs onto the crew calendar and warns you about clashes before they happen.',
    status: 'available',
    metric: { label: 'Clashes caught', value: '11' },
    config: { crewCount: 3, bufferDays: 1 },
    async run() {
      await wait(700);
      return { ok: true, summary: 'Proposed 2 crew slots for next week', detail: 'Scheduling · no clashes' };
    },
  });

  engine.register({
    id: 'reputation',
    name: 'Review Requests',
    category: 'Reputation',
    icon: 'star',
    blurb: 'Asks happy customers for a Google review at the perfect moment after a job wraps.',
    status: 'available',
    metric: { label: 'Reviews / mo', value: '9' },
    config: { delayHours: 24, platform: 'Google' },
    async run(ctx) {
      await wait(500);
      return { ok: true, summary: `Review request sent — ${ctx.client || 'customer'}`, detail: 'Reputation · Google' };
    },
  });

  engine.register({
    id: 'call-summary',
    name: 'Call Summaries',
    category: 'Lead response',
    icon: 'phone',
    blurb: 'Transcribes missed & inbound calls, extracts the job details, and creates the lead for you.',
    status: 'coming-soon',
    metric: { label: 'Status', value: 'In build' },
    config: {},
  });

  engine.register({
    id: 'material-orders',
    name: 'Material Ordering',
    category: 'Operations',
    icon: 'truck',
    blurb: 'Turns an accepted quote into a supplier order list and tracks delivery against the schedule.',
    status: 'coming-soon',
    metric: { label: 'Status', value: 'Planned' },
    config: {},
  });

  // expose
  window.BlackbeamAutomations = engine;
})();
