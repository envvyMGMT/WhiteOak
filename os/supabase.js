/* ============================================================
   BLACKBEAM OS — Supabase connection layer
   ------------------------------------------------------------
   Bridges the app to the live database. When a user is signed in,
   loadAll() returns real data shaped exactly like the demo OS_DATA,
   so the views don't change. When signed out, the app falls back to
   the demo data (public /os/ demo keeps working with no login).

   Publishable key is safe to ship — row-level security protects data.
   ============================================================ */
window.BlackbeamSB = (function () {
  const URL = 'https://ivxbznqouzlpskgfyxiy.supabase.co';
  const KEY = 'sb_publishable_v8Oyy2PUHdf8bpu6a2uvwg_-UsCibYO';

  let client = null, ready = null, orgId = null;

  // True only if a Supabase auth session is already stored — lets the public
  // demo skip loading the SDK entirely (no network) unless someone's signed in.
  function hasStoredToken() {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.indexOf('sb-') === 0 && k.indexOf('-auth-token') > 0) return true;
      }
    } catch (e) {}
    return false;
  }

  async function init() {
    if (ready) return ready;
    ready = (async () => {
      const mod = await Promise.race([
        import('https://esm.sh/@supabase/supabase-js@2'),
        new Promise((_, rej) => setTimeout(() => rej(new Error('supabase load timeout')), 8000)),
      ]);
      client = mod.createClient(URL, KEY, { auth: { persistSession: true, autoRefreshToken: true } });
      return client;
    })();
    return ready;
  }

  /* ---------- helpers ---------- */
  const initials = (n) => ((n || '').trim().split(/\s+/).map((w) => w[0] || '').join('').slice(0, 2).toUpperCase()) || 'NN';
  function ago(ts) {
    if (!ts) return '';
    const d = (Date.now() - new Date(ts).getTime()) / 1000;
    if (d < 90) return 'Just now';
    if (d < 3600) return Math.round(d / 60) + ' min ago';
    if (d < 86400) return Math.round(d / 3600) + ' hrs ago';
    if (d < 172800) return 'Yesterday';
    return Math.round(d / 86400) + ' days ago';
  }
  const dt = (s) => s ? new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—';

  /* ---------- row -> view shape ---------- */
  const mapLead = (r) => ({ id: r.id, name: r.name, initials: initials(r.name), job: r.job || '—', source: r.source || 'Website form', loc: r.location || '—', received: ago(r.created_at), status: r.status || 'New', ai: r.status === 'New' ? '' : '0:47', value: Number(r.est_value) || 0 });
  const mapQuote = (r) => ({ id: r.id, client: r.client || '—', job: r.job || '—', amount: Number(r.amount) || 0, status: r.status || 'Draft', ai: !!r.ai_drafted, date: ago(r.created_at), viewed: r.status === 'Viewed' });
  const mapInvoice = (r) => ({ id: r.id, client: r.client || '—', job: r.job || '—', amount: Number(r.amount) || 0, status: r.status || 'Draft', due: dt(r.due_date), chased: !!r.chased });
  const mapFollow = (r) => { const p = (r.subject || '').split(' — '); return { id: r.id, client: p[0] || r.subject || '—', re: p[1] || '', when: r.run_at ? dt(r.run_at) : 'Queued', channel: r.channel || 'SMS', seq: r.sequence || '—', auto: r.automated !== false }; };
  const mapJob = (r) => ({ id: r.id, title: r.title, client: r.client || '—', tag: r.tag || '—', value: Number(r.value) || 0, crew: r.crew || [], progress: r.progress || 0, when: r.stage === 'Done' ? 'Completed' : (r.progress ? ('~' + r.progress + '% complete') : 'Scheduled') });
  const STAGES = ['Scheduled', 'In progress', 'Blocked', 'Done'];

  /* ---------- form -> db columns (for creates) ---------- */
  const toDb = {
    lead: (d) => ({ name: d.name, phone: d.phone, email: d.email, source: d.source, job: d.job, location: d.loc, status: 'New', est_value: +d.value || 0 }),
    quote: (d) => ({ client: d.client, job: d.job, amount: +d.amount || 0, status: d.status || 'Draft', ai_drafted: false }),
    job: (d) => ({ title: d.title, client: d.client, tag: d.tag, stage: d.stage || 'Scheduled', value: +d.value || 0, crew: ['JR'] }),
    invoice: (d) => ({ client: d.client, job: d.job, amount: +d.amount || 0, status: d.status || 'Draft', due_date: null, chased: false }),
    followup: (d) => ({ subject: (d.client || 'Lead') + ' — ' + (d.name || d.re || ''), channel: (d.channel || 'SMS').split(' ')[0], sequence: (d.name || 'Sequence') + ' · step 1', automated: true }),
  };
  const TABLE = { lead: 'leads', quote: 'quotes', job: 'jobs', invoice: 'invoices', followup: 'followups' };
  const MAP = { lead: mapLead, quote: mapQuote, invoice: mapInvoice, followup: mapFollow, job: mapJob };

  /* ---------- public API ---------- */
  async function session() { const c = await init(); const { data } = await c.auth.getSession(); return data.session; }

  async function resolveOrg() {
    const c = await init();
    const { data } = await c.from('memberships').select('org_id').limit(1).maybeSingle();
    orgId = data ? data.org_id : null;
    return orgId;
  }

  async function signIn(email, password) { const c = await init(); const r = await c.auth.signInWithPassword({ email, password }); if (!r.error) await resolveOrg(); return r; }
  async function signUp(email, password) { const c = await init(); const r = await c.auth.signUp({ email, password }); if (!r.error && r.data.session) await resolveOrg(); return r; }
  async function signOut() { const c = await init(); await c.auth.signOut(); orgId = null; }

  async function loadAll(demo) {
    const c = await init();
    if (!orgId) await resolveOrg();
    const q = (t) => c.from(t).select('*').order('created_at', { ascending: false });
    const [L, Q, J, I, F] = await Promise.all([q('leads'), q('quotes'), q('jobs'), q('invoices'), q('followups')]);
    const jobs = {}; STAGES.forEach((s) => (jobs[s] = []));
    (J.data || []).forEach((r) => { (jobs[r.stage] || jobs.Scheduled).push(mapJob(r)); });
    const leads = (L.data || []).map(mapLead);
    // pipeline computed from live leads; keep demo insight widgets (activity/kpis)
    const counts = { New: 0, Replied: 0, Quoted: 0, Won: 0 };
    leads.forEach((l) => { if (counts[l.status] != null) counts[l.status]++; });
    const pipeline = [
      { stage: 'New', n: counts.New, color: 'var(--info)' },
      { stage: 'Replied', n: counts.Replied, color: 'var(--hivis)' },
      { stage: 'Quoted', n: counts.Quoted, color: 'var(--warn)' },
      { stage: 'Won', n: counts.Won, color: 'var(--ok)' },
    ];
    return {
      leads, quotes: (Q.data || []).map(mapQuote), jobs,
      invoices: (I.data || []).map(mapInvoice), followups: (F.data || []).map(mapFollow),
      activity: demo.activity, kpis: demo.kpis, pipeline,
    };
  }

  async function create(kind, formData) {
    const c = await init();
    if (!orgId) await resolveOrg();
    const row = Object.assign({ org_id: orgId }, toDb[kind](formData));
    const { data, error } = await c.from(TABLE[kind]).insert(row).select().single();
    if (error) throw error;
    return MAP[kind](data);
  }
  async function update(table, id, patch) { const c = await init(); return c.from(table).update(patch).eq('id', id); }
  async function logRun(automationKey, input, output, ok) {
    const c = await init(); if (!orgId) await resolveOrg();
    return c.from('automation_runs').insert({ org_id: orgId, automation_key: automationKey, input, output, ok });
  }

  return { init, hasStoredToken, session, signIn, signUp, signOut, loadAll, create, update, logRun, get orgId() { return orgId; } };
})();
