/* ============================================================
   BLACKBEAM OS — application controller
   Static SPA: hash router, view rendering, theme, automations.
   ============================================================ */
(function () {
  const D = window.OS_DATA;
  const AE = window.BlackbeamAutomations;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const money = (n) => '$' + Number(n).toLocaleString('en-US');

  /* ---------------- icons ---------------- */
  const P = {
    bolt: '<path d="M13 2 3 14h7l-1 8 10-12h-7z"/>',
    doc: '<path d="M6 2h9l4 4v16H6z"/><path d="M14 2v5h5"/>',
    repeat: '<path d="M17 2l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>',
    receipt: '<path d="M6 2h12v20l-3-2-3 2-3-2-3 2z"/><path d="M9 7h6M9 11h6"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    star: '<path d="M12 2l3 6.9 7.5.6-5.7 4.9 1.8 7.3L12 17.8 5.1 21.7l1.8-7.3L1.2 9.5 8.7 8.9z"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/>',
    truck: '<path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    up: '<path d="M12 19V5M5 12l7-7 7 7"/>',
    down: '<path d="M12 5v14M5 12l7 7 7-7"/>',
    right: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    msg: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    google: '<path d="M21 12.2c0-.6 0-1.2-.1-1.7H12v3.4h5a4.3 4.3 0 0 1-1.9 2.8v2.3h3A9 9 0 0 0 21 12.2z"/><path d="M12 21a9 9 0 0 0 6.1-2.2l-3-2.3a5.4 5.4 0 0 1-8-2.8H4v2.4A9 9 0 0 0 12 21z"/><path d="M7.1 13.7a5.4 5.4 0 0 1 0-3.4V7.9H4a9 9 0 0 0 0 8.2z"/><path d="M12 6.6a4.9 4.9 0 0 1 3.4 1.3l2.6-2.6A8.6 8.6 0 0 0 12 3a9 9 0 0 0-8 4.9l3.1 2.4A5.4 5.4 0 0 1 12 6.6z"/>',
    fb: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1A4 4 0 0 1 16 11"/>',
    dollar: '<path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
    inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5 5h14l3 7v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-6z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    ext: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6M10 14 21 3"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>',
    card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
    link: '<path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"/>',
    sparkle: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/>',
    play: '<path d="M8 5v14l11-7z"/>',
    trend: '<path d="M3 17l6-6 4 4 8-8"/><path d="M21 7v6M15 7h6"/>',
    building: '<path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M9 8h2M9 12h2M9 16h2"/><path d="M15 21V9h2a2 2 0 0 1 2 2v10"/>',
    tag: '<path d="M20 12l-8.6 8.6a2 2 0 0 1-2.8 0L2 14V4a2 2 0 0 1 2-2h10z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
    palette: '<circle cx="12" cy="12" r="10"/><circle cx="8" cy="10" r="1"/><circle cx="12" cy="7" r="1"/><circle cx="16" cy="10" r="1"/><path d="M12 22a3 3 0 0 0 0-6 2 2 0 0 1 2-2h1a4 4 0 0 0 4-4"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="M10.8 12.2 20 3M17 6l3 3M15 8l2 2"/>',
  };
  // width/height attributes are a safe fallback (CSS still overrides them
  // wherever a rule sets an explicit size) so no icon can render at the
  // 300x150 default if a stylesheet rule is missing.
  const svg = (name, cls) => `<svg viewBox="0 0 24 24" width="18" height="18"${cls ? ` class="${cls}"` : ''}>${P[name] || ''}</svg>`;
  const fill = (name) => `<svg viewBox="0 0 24 24" width="18" height="18" style="fill:currentColor;stroke:none">${P[name] || ''}</svg>`;

  /* ---------------- status maps ---------------- */
  const LEAD_ST = { New: 'info', Replied: 'hivis', Quoted: 'warn', Won: 'ok', Lost: 'bad' };
  const QUOTE_ST = { Draft: '', Sent: 'info', Viewed: 'hivis', Accepted: 'ok', Declined: 'bad' };
  const INV_ST = { Draft: '', Sent: 'info', Paid: 'ok', Overdue: 'bad' };
  const SRC_IC = { 'Website form': 'inbox', Google: 'google', Referral: 'users', Facebook: 'fb' };

  const badge = (txt, cls) => `<span class="badge ${cls || ''}"><span class="bd"></span>${txt}</span>`;

  /* ---------------- toast ---------------- */
  function toast(title, sub, type) {
    const host = $('#toastHost');
    const t = document.createElement('div');
    t.className = 'toast ' + (type || '');
    t.innerHTML = `<div class="ti">${svg(type === 'ok' ? 'check' : 'bolt')}</div>
      <div class="tx"><div class="th">${title}</div>${sub ? `<div class="ts">${sub}</div>` : ''}</div>`;
    host.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(20px)'; t.style.transition = '.3s'; }, 4200);
    setTimeout(() => t.remove(), 4600);
  }

  /* ============================================================ VIEWS */
  const V = {};

  V.dashboard = () => {
    const k = D.kpis;
    const stat = (key, ic) => {
      const s = k[key];
      const goodDown = s.good === 'down';
      const positive = goodDown ? s.delta < 0 : s.delta > 0;
      const dcls = positive ? 'up' : (s.delta === 0 ? 'flat' : 'down');
      const arrow = s.delta > 0 ? 'up' : (s.delta < 0 ? 'down' : 'right');
      return `<div class="card stat">
        <div class="k">${svg(ic)} ${s.label}</div>
        <div class="v">${s.value}${s.unit ? ` <small>${s.unit}</small>` : ''}</div>
        <div class="d ${dcls}">${svg(arrow)} ${Math.abs(s.delta)}%${s.note ? `<span style="color:var(--muted);font-weight:500;margin-left:4px">${s.note}</span>` : ''}</div>
      </div>`;
    };
    const total = D.pipeline.reduce((a, b) => a + b.n, 0);
    const pipe = D.pipeline.map((p) => `<div class="seg" style="flex:${p.n};background:${p.color}"></div>`).join('');
    const legend = D.pipeline.map((p) => `<div class="li"><span class="sw" style="background:${p.color}"></span>${p.stage} <b>${p.n}</b></div>`).join('');
    const feed = D.activity.map((a) => `<div class="feed-row">
      <div class="feed-ic ${a.kind}">${svg(a.kind === 'ok' ? 'check' : 'bolt')}</div>
      <div class="feed-body"><div class="t">${a.t}</div><div class="s">${a.s}</div></div>
      <div class="feed-time">${a.time}</div></div>`).join('');
    const sched = Object.values(D.jobs).flat().filter((j) => j.progress || j.when.startsWith('Day')).slice(0, 3)
      .map((j) => `<div class="feed-row"><div class="feed-ic">${svg('calendar')}</div>
        <div class="feed-body"><div class="t">${j.title}</div><div class="s">${j.when} · ${money(j.value)}</div></div>
        ${j.progress ? `<div class="feed-time">${j.progress}%</div>` : ''}</div>`).join('');

    return `
      <div class="page-head">
        <div><h1>Good morning, Eli</h1><div class="sub">Here's what Blackbeam OS handled while you were on the tools.</div></div>
        <div class="head-actions">
          <button class="btn btn-ghost btn-sm" data-action="sim-lead">${svg('sparkle')} Simulate new lead</button>
          <span class="badge hivis"><span class="bd"></span>${AE.active().length} automations running</span>
        </div>
      </div>

      <div class="grid cols-4" style="margin-bottom:16px">
        ${stat('response', 'clock')}${stat('quotes', 'doc')}${stat('winrate', 'trend')}
        ${stat('jobs', 'building')}${stat('revenue', 'dollar')}${stat('outstanding', 'receipt')}
      </div>

      <div class="grid" style="grid-template-columns:1.55fr 1fr;gap:16px">
        <div class="card">
          <div class="card-h"><h3>Live activity</h3><a class="link" href="#/automations">Automations ${svg('right')}</a></div>
          <div class="feed">${feed}</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:16px">
          <div class="card">
            <div class="card-h"><h3>Lead pipeline</h3><a class="link" href="#/leads">${total} open ${svg('right')}</a></div>
            <div class="card-b"><div class="pipe">${pipe}</div><div class="pipe-legend">${legend}</div></div>
          </div>
          <div class="card">
            <div class="card-h"><h3>On the calendar</h3><a class="link" href="#/jobs">Jobs ${svg('right')}</a></div>
            <div class="feed">${sched}</div>
          </div>
        </div>
      </div>`;
  };

  V.leads = () => {
    const f = state.leadFilter;
    let list = D.leads.slice();
    if (f.status !== 'all') list = list.filter((l) => l.status === f.status);
    if (f.source !== 'all') list = list.filter((l) => l.source === f.source);
    if (f.q) { const q = f.q.toLowerCase(); list = list.filter((l) => (l.name + ' ' + l.job + ' ' + l.loc).toLowerCase().includes(q)); }
    const rows = list.map((l) => `<tr data-action="open" data-kind="lead" data-id="${l.id}">
      <td><div class="cell-name"><span class="mini-av">${l.initials}</span>
        <div><div class="strong">${l.name}</div><div class="muted" style="font-size:12px">${l.job}</div></div></div></td>
      <td><span class="src">${svg(SRC_IC[l.source] || 'inbox')} ${l.source}</span></td>
      <td class="muted">${l.loc}</td>
      <td class="muted">${l.received}</td>
      <td>${l.ai ? `<span class="chip-ai">${fill('bolt')} ${l.ai}</span>` : '<span class="muted">—</span>'}</td>
      <td class="tnum strong">${money(l.value)}</td>
      <td>${badge(l.status, LEAD_ST[l.status])}</td>
    </tr>`).join('') || `<tr><td colspan="7"><div class="empty" style="padding:38px 20px">${svg('inbox')}<h3>No leads match</h3><p>Try a different filter.</p></div></td></tr>`;
    const nNew = D.leads.filter((l) => l.status === 'New').length;
    const tab = (label, val, n) => `<button class="tab ${f.status === val ? 'active' : ''}" data-action="filter-lead" data-status="${val}">${label}${n != null ? ` <b>${n}</b>` : ''}</button>`;
    return `
      <div class="page-head"><div><h1>Leads</h1><div class="sub">Every inquiry, auto-answered the moment it lands.</div></div>
        <div class="head-actions"><button class="btn btn-ghost btn-sm" data-action="sim-lead">${svg('sparkle')} Simulate new lead</button>
        <button class="btn btn-primary btn-sm" data-action="new" data-kind="lead">${svg('plus')} Add lead</button></div></div>
      <div class="toolbar">
        <div class="tabs">${tab('All', 'all', D.leads.length)}${tab('New', 'New', nNew)}${tab('Quoted', 'Quoted')}${tab('Won', 'Won')}</div>
        <div class="spacer"></div>
        <select class="select" data-action="filter-source">
          <option value="all">All sources</option>
          ${['Website form', 'Google', 'Referral', 'Facebook'].map((s) => `<option${f.source === s ? ' selected' : ''}>${s}</option>`).join('')}
        </select>
      </div>
      <div class="card"><div class="card-b flush"><table class="tbl">
        <thead><tr><th>Lead</th><th>Source</th><th>Location</th><th>Received</th><th>AI reply</th><th>Est. value</th><th>Status</th></tr></thead>
        <tbody>${rows}</tbody></table></div></div>`;
  };

  V.quotes = () => {
    const rows = D.quotes.map((q) => `<tr data-action="open" data-kind="quote" data-id="${q.id}">
      <td class="tnum strong">${q.id}</td>
      <td><div class="strong">${q.client}</div><div class="muted" style="font-size:12px">${q.job}</div></td>
      <td class="tnum strong">${money(q.amount)}</td>
      <td>${q.ai ? `<span class="chip-ai">${fill('bolt')} AI draft</span>` : '<span class="muted" style="font-size:12px">Manual</span>'}</td>
      <td class="muted">${q.date}</td>
      <td>${badge(q.status, QUOTE_ST[q.status])}</td>
    </tr>`).join('');
    const accepted = D.quotes.filter((q) => q.status === 'Accepted').reduce((a, b) => a + b.amount, 0);
    const outstanding = D.quotes.filter((q) => ['Sent', 'Viewed'].includes(q.status)).reduce((a, b) => a + b.amount, 0);
    return `
      <div class="page-head"><div><h1>Quotes</h1><div class="sub">Drafted by AI, approved by you, sent in minutes.</div></div>
        <div class="head-actions"><button class="btn btn-ghost btn-sm" data-action="new" data-kind="quote">${svg('plus')} New quote</button>
        <button class="btn btn-primary btn-sm" data-action="ai-quote">${fill('bolt')} Generate with AI</button></div></div>
      <div class="grid cols-3" style="margin-bottom:16px">
        <div class="card stat"><div class="k">${svg('check')} Accepted (30d)</div><div class="v">${money(accepted)}</div></div>
        <div class="card stat"><div class="k">${svg('doc')} Out for signature</div><div class="v">${money(outstanding)}</div></div>
        <div class="card stat"><div class="k">${svg('clock')} Avg draft time</div><div class="v">2.4 <small>min</small></div></div>
      </div>
      <div class="card"><div class="card-b flush"><table class="tbl">
        <thead><tr><th>Quote</th><th>Client / job</th><th>Amount</th><th>Origin</th><th>Date</th><th>Status</th></tr></thead>
        <tbody>${rows}</tbody></table></div></div>`;
  };

  V.jobs = () => {
    const cols = Object.entries(D.jobs).map(([name, arr]) => {
      const cards = arr.map((j) => `<div class="job-card" data-action="open" data-kind="job" data-id="${j.id}">
        <div class="jt">${j.title}</div>
        <div class="jm">${svg('tag')} ${j.tag} · ${money(j.value)}</div>
        ${j.progress ? `<div class="bar-wrap" style="margin-top:10px"><div class="bar-fill" style="width:${j.progress}%"></div></div>` : ''}
        <div class="jf"><div class="crew">${j.crew.map((c) => `<span>${c}</span>`).join('')}</div>
          <span class="muted" style="font-size:11.5px">${j.when}</span></div>
      </div>`).join('');
      return `<div class="col"><div class="col-h">${name} <b>${arr.length}</b></div>${cards}</div>`;
    }).join('');
    return `
      <div class="page-head"><div><h1>Jobs</h1><div class="sub">Crew and jobs, always in sync.</div></div>
        <div class="head-actions"><button class="btn btn-ghost btn-sm" data-action="soon" data-label="Calendar view">${svg('calendar')} Calendar</button>
        <button class="btn btn-primary btn-sm" data-action="new" data-kind="job">${svg('plus')} New job</button></div></div>
      <div class="board">${cols}</div>`;
  };

  V.invoices = () => {
    const rows = D.invoices.map((i) => `<tr data-action="open" data-kind="invoice" data-id="${i.id}">
      <td class="tnum strong">${i.id}</td>
      <td><div class="strong">${i.client}</div><div class="muted" style="font-size:12px">${i.job}</div></td>
      <td class="tnum strong">${money(i.amount)}</td>
      <td class="muted">${i.due}</td>
      <td>${i.chased ? `<span class="chip-ai">${fill('bolt')} Auto-chasing</span>` : '<span class="muted" style="font-size:12px">—</span>'}</td>
      <td>${badge(i.status, INV_ST[i.status])}</td>
    </tr>`).join('');
    const paid = D.invoices.filter((i) => i.status === 'Paid').reduce((a, b) => a + b.amount, 0);
    const due = D.invoices.filter((i) => ['Sent', 'Overdue'].includes(i.status)).reduce((a, b) => a + b.amount, 0);
    const over = D.invoices.filter((i) => i.status === 'Overdue').reduce((a, b) => a + b.amount, 0);
    return `
      <div class="page-head"><div><h1>Invoices</h1><div class="sub">Sent on milestones, chased automatically.</div></div>
        <div class="head-actions"><button class="btn btn-primary btn-sm" data-action="new" data-kind="invoice">${svg('plus')} New invoice</button></div></div>
      <div class="grid cols-3" style="margin-bottom:16px">
        <div class="card stat"><div class="k">${svg('check')} Paid (30d)</div><div class="v">${money(paid)}</div></div>
        <div class="card stat"><div class="k">${svg('clock')} Outstanding</div><div class="v">${money(due)}</div></div>
        <div class="card stat"><div class="k">${svg('receipt')} Overdue</div><div class="v" style="color:var(--bad)">${money(over)}</div></div>
      </div>
      <div class="card"><div class="card-b flush"><table class="tbl">
        <thead><tr><th>Invoice</th><th>Client / job</th><th>Amount</th><th>Due</th><th>Collection</th><th>Status</th></tr></thead>
        <tbody>${rows}</tbody></table></div></div>`;
  };

  V.followups = () => {
    const rows = D.followups.map((f) => `<div class="feed-row">
      <div class="feed-ic ${f.auto ? 'ai' : ''}">${svg(f.channel === 'SMS' ? 'msg' : 'mail')}</div>
      <div class="feed-body"><div class="t">${f.client} — ${f.re}</div>
        <div class="s">${f.seq} · ${f.channel}</div></div>
      <div style="display:flex;align-items:center;gap:12px">
        ${f.auto ? `<span class="chip-ai">${fill('bolt')} Auto</span>` : badge('Manual', '')}
        <div class="feed-time">${f.when}</div></div></div>`).join('');
    return `
      <div class="page-head"><div><h1>Follow-ups</h1><div class="sub">The gentle, persistent nudge that closes quiet leads — on autopilot.</div></div>
        <div class="head-actions"><button class="btn btn-ghost btn-sm" data-action="soon" data-label="Sequence editor">${svg('repeat')} Sequences</button>
        <button class="btn btn-primary btn-sm" data-action="new" data-kind="sequence">${svg('plus')} New sequence</button></div></div>
      <div class="list-split">
        <div class="card"><div class="card-h"><h3>Queued (${D.followups.length})</h3>
          <span class="chip-ai">${fill('bolt')} ${D.followups.filter((f) => f.auto).length} automated</span></div>
          <div class="feed">${rows}</div></div>
        <div class="card"><div class="card-h"><h3>Active sequences</h3></div><div class="card-b">
          ${[['New lead', '2 steps · SMS → email', 87], ['Quote nudge', '3 steps · until reply', 64], ['Post-job review', '1 step · 24h after close', 92], ['Cold win-back', '2 steps · 30/60 days', 21]]
            .map(([n, d, p]) => `<div style="margin-bottom:15px"><div style="display:flex;justify-content:space-between;margin-bottom:6px">
              <span class="strong" style="font-size:13.5px">${n}</span><span class="muted mono" style="font-size:12px">${p}% reply</span></div>
              <div class="muted" style="font-size:12px;margin-bottom:7px">${d}</div>
              <div class="bar-wrap"><div class="bar-fill" style="width:${p}%"></div></div></div>`).join('')}
        </div></div>
      </div>`;
  };

  V.automations = () => {
    const mods = AE.all();
    const active = mods.filter((m) => m.status === 'active').length;
    const cards = mods.map((m) => {
      const on = m.status === 'active';
      const soon = m.status === 'coming-soon';
      return `<div class="auto-card ${on ? 'on' : ''} ${soon ? 'soon' : ''}" data-auto="${m.id}">
        <div class="auto-top">
          <div class="auto-ic">${svg(m.icon)}</div>
          <div class="auto-tt"><h3>${m.name}</h3><div class="cat">${m.category}</div></div>
          ${soon ? badge('Soon', '') : `<button class="switch ${on ? 'on' : ''}" data-action="toggle-auto" data-id="${m.id}" aria-label="Toggle ${m.name}"></button>`}
        </div>
        <div class="auto-desc">${m.blurb}</div>
        ${m.metric ? `<div class="auto-metric">${svg(on ? 'trend' : 'clock')} <b>${m.metric.value}</b> ${m.metric.label}</div>` : ''}
        <div class="auto-foot">
          ${soon ? '<span class="badge">In development</span>'
            : `<span class="badge ${on ? 'ok' : ''}"><span class="bd"></span>${on ? 'Active' : 'Available'}</span>`}
          ${soon ? '' : `<button class="btn btn-ghost btn-sm" data-action="run-auto" data-id="${m.id}">${svg('play')} Run test</button>`}
        </div>
      </div>`;
    }).join('');

    return `
      <div class="page-head"><div><h1>Automations</h1><div class="sub">Your back office, running itself. Toggle what you want on — Blackbeam AI does the rest.</div></div></div>

      <div class="auto-hero"><div class="auto-hero-in">
        <div class="mk">${fill('bolt')}</div>
        <div><h2>Blackbeam AI engine</h2><p>The intelligence layer behind every automation. New skills roll out here as they're built — no setup, no new tools to learn.</p></div>
        <div class="metrics">
          <div class="m"><div class="mv">${active}</div><div class="ml">Active</div></div>
          <div class="m"><div class="mv">1,284</div><div class="ml">Runs / mo</div></div>
          <div class="m"><div class="mv">31 hrs</div><div class="ml">Saved / mo</div></div>
        </div>
      </div></div>

      <div class="auto-grid">${cards}</div>

      <div class="card" style="margin-top:16px" id="runLogCard">
        <div class="card-h"><h3>Engine log</h3><span class="muted mono" style="font-size:11px">live · demo output</span></div>
        <div class="feed" id="runLog">
          <div class="feed-row"><div class="feed-ic ai">${svg('bolt')}</div>
            <div class="feed-body"><div class="t">Engine started — 4 automations active</div>
            <div class="s">Blackbeam AI · ready</div></div><div class="feed-time">now</div></div>
        </div>
      </div>`;
  };

  V.settings = () => {
    const integ = [
      ['mail', 'Email (SMTP)', 'Send quotes, invoices & follow-ups', true],
      ['msg', 'SMS gateway', 'Instant replies & text nudges', true],
      ['calendar', 'Google Calendar', 'Sync crew schedule & jobs', true],
      ['card', 'Stripe payments', 'Pay links on invoices', false],
      ['google', 'Google Business', 'Auto review requests', false],
      ['key', 'Automation API', 'Connect the Blackbeam AI engine', true],
    ];
    const rows = integ.map(([ic, n, d, on]) => `<div class="integration" data-integration="${n}">
      <div class="glyph">${svg(ic)}</div>
      <div class="it"><div class="n">${n}</div><div class="d">${d}</div></div>
      ${on ? badge('Connected', 'ok') : `<button class="btn btn-ghost btn-sm" data-action="connect" data-name="${n}">${svg('link')} Connect</button>`}
    </div>`).join('');
    return `
      <div class="page-head"><div><h1>Settings</h1><div class="sub">Your workspace, brand, team and connections.</div></div></div>
      <div class="settings-grid">
        <nav class="set-nav">
          ${['Company', 'Branding', 'Team', 'Integrations', 'Automation keys', 'Billing'].map((s, i) => `<a class="${i === 0 ? 'active' : ''}" data-action="set-tab" data-tab="${s}">${s}</a>`).join('')}
        </nav>
        <div>
          <div class="card" style="margin-bottom:16px"><div class="card-h"><h3>Company profile</h3></div><div class="card-b">
            <div class="grid cols-2">
              <div class="field"><label>Business name</label><input class="input" value="Blackbeam LLC"></div>
              <div class="field"><label>Trade</label><input class="input" value="General contractor"></div>
              <div class="field"><label>Phone</label><input class="input" value="(417) 555-0100"></div>
              <div class="field"><label>Email</label><input class="input" value="hello@blackbeam.co"></div>
              <div class="field"><label>Service area</label><input class="input" value="Springfield, Nixa, Ozark, Republic"></div>
              <div class="field"><label>License #</label><input class="input" value="MO-GC-0042817"></div>
            </div>
            <div class="field"><label>AI voice & tone</label>
              <textarea>Friendly, plain-spoken, no jargon — the way a crew lead would talk. Confident, fast, never pushy.</textarea></div>
            <button class="btn btn-primary btn-sm" data-action="save-settings">${svg('check')} Save changes</button>
          </div></div>
          <div class="card"><div class="card-h"><h3>Integrations</h3>
            <span class="muted mono" style="font-size:11px">${integ.filter((i) => i[3]).length}/${integ.length} connected</span></div>
            <div class="card-b">${rows}</div></div>
        </div>
      </div>`;
  };

  /* ============================================================ MODALS / CREATE / DETAIL */
  const state = { leadFilter: { status: 'all', source: 'all', q: '' } };
  const reRender = () => route();
  const initials = (n) => ((n || '').trim().split(/\s+/).map((w) => w[0] || '').join('').slice(0, 2).toUpperCase()) || 'NN';

  function closeModal() { const m = $('#modalRoot'); if (m) m.remove(); }
  function openModal(opts) {
    closeModal();
    const root = document.createElement('div');
    root.id = 'modalRoot'; root.className = 'modal-overlay';
    const footer = opts.onSubmit
      ? `<div class="modal-f"><button type="button" class="btn btn-ghost btn-sm" data-close>Cancel</button>
         <button type="submit" form="modalForm" class="btn btn-primary btn-sm">${opts.submitLabel || 'Save'}</button></div>`
      : `<div class="modal-f"><button type="button" class="btn btn-ghost btn-sm" data-close>Close</button>${opts.actions || ''}</div>`;
    root.innerHTML = `<div class="modal" role="dialog" aria-modal="true">
      <div class="modal-h"><div><h3>${opts.title}</h3>${opts.sub ? `<div class="modal-sub">${opts.sub}</div>` : ''}</div>
        <button class="modal-x" data-close aria-label="Close">&times;</button></div>
      <form class="modal-b" id="modalForm">${opts.body}</form>${footer}</div>`;
    document.body.appendChild(root);
    root.addEventListener('click', (e) => { if (e.target === root || e.target.closest('[data-close]')) closeModal(); });
    const form = $('#modalForm', root);
    if (opts.onSubmit) form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = {}; new FormData(form).forEach((v, k) => (data[k] = v));
      opts.onSubmit(data);
    });
    const first = form.querySelector('input,select,textarea'); if (first) setTimeout(() => first.focus(), 40);
  }
  function fld(label, name, o) {
    o = o || {};
    const req = o.required ? ' required' : '';
    const star = o.required ? ' <span style="color:var(--hivis)">*</span>' : '';
    let ctrl;
    if (o.options) ctrl = `<select class="select" name="${name}" style="width:100%"${req}>${o.options.map((op) => `<option${op === o.value ? ' selected' : ''}>${op}</option>`).join('')}</select>`;
    else if (o.type === 'textarea') ctrl = `<textarea name="${name}" placeholder="${o.placeholder || ''}"${req}>${o.value || ''}</textarea>`;
    else ctrl = `<input class="input" style="width:100%" type="${o.type || 'text'}" name="${name}" placeholder="${o.placeholder || ''}" value="${o.value || ''}"${req}>`;
    return `<div class="field"><label>${label}${star}</label>${ctrl}</div>`;
  }
  const two = (a, b) => `<div class="grid cols-2" style="gap:0 14px">${a}${b}</div>`;

  const CREATE = {
    lead: {
      title: 'New lead', submit: 'Add lead',
      body: () => fld('Name', 'name', { required: true, placeholder: 'Client name' })
        + two(fld('Phone', 'phone', { type: 'tel', placeholder: '(417) 000-0000' }), fld('Est. value ($)', 'value', { type: 'number', placeholder: '12000' }))
        + fld('Job', 'job', { placeholder: 'e.g. Kitchen remodel' })
        + two(fld('Source', 'source', { options: ['Website form', 'Google', 'Referral', 'Facebook'] }), fld('Location', 'loc', { options: ['Springfield', 'Nixa', 'Ozark', 'Republic', 'Battlefield'] })),
      save: (d) => { const l = { id: 'L-' + (2052 + D.leads.length), name: d.name, initials: initials(d.name), job: d.job || '—', source: d.source, loc: d.loc, received: 'Just now', status: 'New', ai: '0:' + (35 + Math.floor(Math.random() * 20)), value: +d.value || 0 }; D.leads.unshift(l); return l; },
      done: (l) => toast('Lead added', l.name + ' · ' + l.job, 'ok'),
    },
    quote: {
      title: 'New quote', submit: 'Create quote',
      body: () => fld('Client', 'client', { required: true }) + fld('Job', 'job', { placeholder: 'Scope of work' })
        + two(fld('Amount ($)', 'amount', { type: 'number', required: true }), fld('Status', 'status', { options: ['Draft', 'Sent'] })),
      save: (d) => { const q = { id: '#Q-' + (1043 + D.quotes.length), client: d.client, job: d.job || '—', amount: +d.amount || 0, status: d.status || 'Draft', ai: false, date: 'Today', viewed: false }; D.quotes.unshift(q); return q; },
      done: (q) => toast('Quote created', q.id + ' · ' + money(q.amount), 'ok'),
    },
    job: {
      title: 'New job', submit: 'Create job',
      body: () => fld('Job title', 'title', { required: true })
        + two(fld('Client', 'client'), fld('Value ($)', 'value', { type: 'number' }))
        + two(fld('Type', 'tag', { options: ['Remodel', 'Addition', 'Concrete', 'Roofing', 'Exterior', 'Framing'] }), fld('Stage', 'stage', { options: ['Scheduled', 'In progress', 'Blocked', 'Done'] })),
      save: (d) => { const j = { id: 'J-' + (319 + Object.values(D.jobs).flat().length), title: d.title, client: d.client || '—', when: 'Just added', crew: ['JR'], value: +d.value || 0, tag: d.tag }; (D.jobs[d.stage] || D.jobs.Scheduled).unshift(j); return j; },
      done: (j) => toast('Job created', j.title, 'ok'),
    },
    invoice: {
      title: 'New invoice', submit: 'Create invoice',
      body: () => two(fld('Client', 'client', { required: true }), fld('Amount ($)', 'amount', { type: 'number', required: true }))
        + fld('Job / description', 'job') + two(fld('Due', 'due', { placeholder: 'Jul 30' }), fld('Status', 'status', { options: ['Draft', 'Sent'] })),
      save: (d) => { const iv = { id: '#' + (1043 + D.invoices.length), client: d.client, job: d.job || '—', amount: +d.amount || 0, status: d.status || 'Draft', due: d.due || '—', chased: false }; D.invoices.unshift(iv); return iv; },
      done: (iv) => toast('Invoice created', iv.id + ' · ' + money(iv.amount), 'ok'),
    },
    sequence: {
      title: 'New follow-up sequence', submit: 'Create sequence',
      body: () => fld('Sequence name', 'name', { required: true, placeholder: 'e.g. Quote nudge' })
        + two(fld('Trigger', 'trigger', { options: ['New lead', 'Quote sent', 'Job complete', 'No reply in 3 days'] }), fld('Channel', 'channel', { options: ['SMS', 'Email', 'SMS → Email'] }))
        + fld('Steps', 'steps', { options: ['1 step', '2 steps', '3 steps', '4 steps'] }),
      save: (d) => { D.followups.unshift({ id: 'F-' + (92 + D.followups.length), client: 'Next matching lead', re: d.name, when: 'Queued', channel: (d.channel || 'SMS').split(' ')[0], seq: d.name + ' · step 1', auto: true }); return d; },
      done: (d) => toast('Sequence created', d.name + ' is now live', 'ok'),
    },
  };
  function openCreate(kind) {
    const c = CREATE[kind]; if (!c) return;
    openModal({ title: c.title, sub: 'Demo — saved to this session only.', submitLabel: c.submit, body: c.body(),
      onSubmit: (d) => { const rec = c.save(d); closeModal(); reRender(); if (c.done) c.done(rec); } });
  }

  const DETAIL = {
    lead: (l) => ({ title: l.name, sub: l.job + ' · ' + l.loc,
      rows: [['Status', l.status], ['Source', l.source], ['AI reply', l.ai || '—'], ['Est. value', money(l.value)], ['Received', l.received], ['Lead ID', l.id]],
      actions: `<button class="btn btn-ghost btn-sm" data-action="lead-reply" data-id="${l.id}">${fill('bolt')} Send instant reply</button>
        <button class="btn btn-primary btn-sm" data-action="lead-win" data-id="${l.id}">${svg('check')} Mark won</button>` }),
    quote: (q) => ({ title: q.id, sub: q.client + ' · ' + q.job,
      rows: [['Amount', money(q.amount)], ['Status', q.status], ['Origin', q.ai ? 'AI draft' : 'Manual'], ['Date', q.date]],
      actions: `<button class="btn btn-primary btn-sm" data-action="quote-accept" data-id="${q.id}">${svg('check')} Mark accepted</button>` }),
    invoice: (iv) => ({ title: iv.id, sub: iv.client + ' · ' + iv.job,
      rows: [['Amount', money(iv.amount)], ['Status', iv.status], ['Due', iv.due], ['Auto-chasing', iv.chased ? 'Yes' : 'No']],
      actions: `<button class="btn btn-primary btn-sm" data-action="invoice-paid" data-id="${iv.id}">${svg('check')} Mark paid</button>` }),
    job: (j) => ({ title: j.title, sub: j.client + ' · ' + j.tag,
      rows: [['Value', money(j.value)], ['Crew', j.crew.join(', ')], ['Timing', j.when], ['Job ID', j.id]],
      actions: `<button class="btn btn-ghost btn-sm" data-action="soon" data-label="Crew messaging">${svg('msg')} Message crew</button>` }),
  };
  const findRec = (kind, id) => kind === 'job'
    ? Object.values(D.jobs).flat().find((x) => x.id === id)
    : (D[kind + 's'] || []).find((x) => x.id === id);
  function openDetail(kind, id) {
    const rec = findRec(kind, id); if (!rec || !DETAIL[kind]) return;
    const d = DETAIL[kind](rec);
    openModal({ title: d.title, sub: d.sub, actions: d.actions,
      body: `<div class="detail-kv">${d.rows.map(([k, v]) => `<div class="kv"><span class="k">${k}</span><span class="v">${v}</span></div>`).join('')}</div>` });
  }

  /* ============================================================ ROUTER */
  const TITLES = { dashboard: 'Dashboard', leads: 'Leads', quotes: 'Quotes', jobs: 'Jobs', invoices: 'Invoices', followups: 'Follow-ups', automations: 'Automations', settings: 'Settings' };

  function route() {
    let r = (location.hash.replace(/^#\//, '') || 'dashboard').split('/')[0];
    if (!V[r]) r = 'dashboard';
    $('#view').innerHTML = V[r]();
    $('#view').scrollTop = 0;
    $('#crumbSection').textContent = TITLES[r];
    document.title = 'Blackbeam OS — ' + TITLES[r];
    $$('.nav-item').forEach((a) => a.classList.toggle('active', a.dataset.route === r));
    document.body.classList.remove('nav-open');
  }

  /* ============================================================ INTERACTIONS */
  function updateCounts() {
    const setPill = (key, val) => $$(`[data-count="${key}"]`).forEach((e) => (e.textContent = val));
    setPill('leads', D.leads.filter((l) => l.status === 'New').length);
    setPill('overdue', D.invoices.filter((i) => i.status === 'Overdue').length);
    setPill('active-automations', AE.active().length);
  }

  // theme
  const THEME_KEY = 'bb-os-theme';
  function applyTheme(t) { document.documentElement.setAttribute('data-theme', t); localStorage.setItem(THEME_KEY, t); }
  applyTheme(localStorage.getItem(THEME_KEY) || 'dark');
  $('#themeToggle').addEventListener('click', () => {
    applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  // sidebar (mobile)
  $('#menuBtn').addEventListener('click', () => document.body.classList.add('nav-open'));
  $('#sidebarScrim').addEventListener('click', () => document.body.classList.remove('nav-open'));
  $('#sideCollapse').addEventListener('click', () => document.body.classList.remove('nav-open'));

  // "/" focuses search
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
    if (e.key === '/' && !/input|textarea/i.test(e.target.tagName)) { e.preventDefault(); $('.search input')?.focus(); }
  });

  // New menu
  const newMenu = $('#newMenu');
  const NEW_ITEMS = [['plus', 'New lead', 'leads'], ['doc', 'New quote', 'quotes'], ['building', 'New job', 'jobs'], ['receipt', 'New invoice', 'invoices'], ['sparkle', 'Run an automation', 'automations']];
  function openNewMenu() {
    newMenu.innerHTML = NEW_ITEMS.map(([ic, label, r]) => `<button data-goto="${r}">${svg(ic)} ${label}</button>`).join('');
    const b = $('#newBtn').getBoundingClientRect();
    newMenu.style.top = b.bottom + 8 + 'px';
    newMenu.style.right = (window.innerWidth - b.right) + 'px';
    newMenu.hidden = false;
  }
  $('#newBtn').addEventListener('click', (e) => { e.stopPropagation(); newMenu.hidden ? openNewMenu() : (newMenu.hidden = true); });
  document.addEventListener('click', (e) => {
    if (!newMenu.hidden && !newMenu.contains(e.target)) newMenu.hidden = true;
    const goto = e.target.closest?.('[data-goto]');
    if (goto) { newMenu.hidden = true; location.hash = '#/' + goto.dataset.goto; }
  });
  $('#bellBtn').addEventListener('click', () => toast('You\'re all caught up', 'Blackbeam AI handled 6 tasks today.', 'ok'));

  // delegated view actions
  function logRun(res, name) {
    const log = $('#runLog'); if (!log) return;
    const row = document.createElement('div');
    row.className = 'feed-row';
    row.innerHTML = `<div class="feed-ic ${res.ok ? 'ai' : ''}">${svg(res.ok ? 'bolt' : 'clock')}</div>
      <div class="feed-body"><div class="t">${res.summary}</div><div class="s">${res.detail || name}</div>
      ${res.output ? `<div class="s" style="text-transform:none;letter-spacing:0;color:var(--ink-2);margin-top:6px;font-family:var(--font-body);font-size:12.5px;background:var(--surface-2);border:1px solid var(--line);border-radius:8px;padding:9px 11px;line-height:1.45">${res.output}</div>` : ''}</div>
      <div class="feed-time">now</div>`;
    log.prepend(row);
  }

  document.addEventListener('click', async (e) => {
    const t = e.target.closest('[data-action]');
    if (!t) return;
    const act = t.dataset.action;

    if (act === 'toggle-auto') {
      const id = t.dataset.id, m = AE.get(id);
      const now = m.status === 'active' ? 'available' : 'active';
      AE.setStatus(id, now);
      t.classList.toggle('on', now === 'active');
      t.closest('.auto-card').classList.toggle('on', now === 'active');
      updateCounts();
      toast(`${m.name} ${now === 'active' ? 'activated' : 'paused'}`, now === 'active' ? 'Blackbeam AI is now handling this.' : 'You\'ll handle this one manually.', now === 'active' ? 'ok' : '');
    }

    if (act === 'run-auto') {
      const id = t.dataset.id, m = AE.get(id);
      t.disabled = true; const orig = t.innerHTML; t.innerHTML = svg('clock') + ' Running…';
      const ctx = { name: 'Priya Anand', job: 'Bathroom renovation', client: 'Priya Anand', value: 15200, id: '#1039' };
      const res = await AE.run(id, ctx);
      t.disabled = false; t.innerHTML = orig;
      logRun(res, m.name);
      toast(res.ok ? `${m.name} ran` : `${m.name}`, res.summary, res.ok ? 'ok' : '');
    }

    if (act === 'sim-lead') {
      toast('New lead received', 'Website form · Springfield', '');
      const res = await AE.run('instant-reply', { name: 'Jordan Hayes', job: 'Kitchen island + counters', value: 12800 });
      setTimeout(() => toast('Instant Reply sent', res.summary, 'ok'), 900);
    }

    if (act === 'ai-quote') {
      toast('Drafting quote…', 'Blackbeam AI is building line items', '');
      const res = await AE.run('instant-quote', { job: 'Bathroom renovation', value: 15200 });
      setTimeout(() => toast('Quote drafted', res.summary + ' — ready to review', 'ok'), 1100);
    }

    if (act === 'new') openCreate(t.dataset.kind);
    if (act === 'open') openDetail(t.dataset.kind, t.dataset.id);
    if (act === 'filter-lead') { state.leadFilter.status = t.dataset.status; reRender(); }
    if (act === 'soon') toast(t.dataset.label || 'Coming soon', 'Fully wired in the production build.', '');
    if (act === 'connect') { const name = t.dataset.name; t.outerHTML = badge('Connected', 'ok'); toast(name + ' connected', 'Integration is now active.', 'ok'); }
    if (act === 'save-settings') toast('Settings saved', 'Your workspace has been updated.', 'ok');
    if (act === 'set-tab') { $$('.set-nav a').forEach((a) => a.classList.toggle('active', a === t)); toast(t.dataset.tab, 'Section shown (demo).', ''); }

    if (act === 'lead-reply') { const l = findRec('lead', t.dataset.id); closeModal(); const res = await AE.run('instant-reply', l || {}); toast('Instant Reply sent', res.summary, 'ok'); }
    if (act === 'lead-win') { const l = findRec('lead', t.dataset.id); if (l) l.status = 'Won'; closeModal(); reRender(); updateCounts(); toast('Marked won 🎉', (l ? l.name : '') + ' moved to Won', 'ok'); }
    if (act === 'quote-accept') { const q = findRec('quote', t.dataset.id); if (q) q.status = 'Accepted'; closeModal(); reRender(); toast('Quote accepted', q ? q.id : '', 'ok'); }
    if (act === 'invoice-paid') { const iv = findRec('invoice', t.dataset.id); if (iv) { iv.status = 'Paid'; iv.chased = false; } closeModal(); reRender(); updateCounts(); toast('Invoice paid', iv ? iv.id + ' · ' + money(iv.amount) : '', 'ok'); }
  });

  // selects (filters)
  document.addEventListener('change', (e) => {
    const t = e.target.closest('[data-action]'); if (!t) return;
    if (t.dataset.action === 'filter-source') { state.leadFilter.source = t.value; reRender(); }
  });

  // topbar search filters leads on Enter
  const searchInput = $('.search input');
  if (searchInput) searchInput.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    state.leadFilter.q = searchInput.value.trim();
    if ((location.hash.replace(/^#\//, '') || 'dashboard') === 'leads') reRender();
    else location.hash = '#/leads';
    searchInput.blur();
  });

  // account / workspace chrome
  $('.avatar')?.addEventListener('click', () => toast('Eli D. · Owner', 'Manage your account in Settings.', ''));
  $('#workspacePill')?.addEventListener('click', () => toast('Blackbeam LLC', 'Workspace switching lands in the full product.', ''));

  document.addEventListener('automations:changed', updateCounts);

  // demo flag (dismiss remembered)
  const demoFlag = $('#demoFlag');
  if (demoFlag) {
    if (localStorage.getItem('bb-os-demoflag') === 'off') demoFlag.classList.add('hide');
    $('#demoFlagX')?.addEventListener('click', () => {
      demoFlag.classList.add('hide');
      localStorage.setItem('bb-os-demoflag', 'off');
    });
  }

  // boot
  window.addEventListener('hashchange', route);
  updateCounts();
  route();
})();
