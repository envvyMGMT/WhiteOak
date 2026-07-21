/* ============================================================
   BLACKBEAM OS — demo data
   Realistic sample data for the shell. Replace with live API
   responses when the backend is available.
   INTEGRATION POINT: swap window.OS_DATA for fetch()'d records.
   ============================================================ */
window.OS_DATA = (function () {

  const leads = [
    { id: 'L-2051', name: 'Marcus Miller', initials: 'MM', job: 'Kitchen remodel', source: 'Website form', loc: 'Springfield', received: '4 min ago', status: 'Replied', ai: '0:47', value: 24000 },
    { id: 'L-2050', name: 'Dana Whitfield', initials: 'DW', job: 'Foundation repair', source: 'Google', loc: 'Nixa', received: '38 min ago', status: 'Quoted', ai: '0:52', value: 8600 },
    { id: 'L-2049', name: 'Priya Anand', initials: 'PA', job: 'Bathroom renovation', source: 'Referral', loc: 'Ozark', received: '2 hrs ago', status: 'New', ai: '0:41', value: 15200 },
    { id: 'L-2048', name: 'Carlos Reyes', initials: 'CR', job: 'Deck + concrete patio', source: 'Facebook', loc: 'Republic', received: '5 hrs ago', status: 'Won', ai: '1:03', value: 19800 },
    { id: 'L-2047', name: 'Sam Okafor', initials: 'SO', job: 'Garage framing', source: 'Website form', loc: 'Springfield', received: 'Yesterday', status: 'New', ai: '0:39', value: 11400 },
    { id: 'L-2046', name: 'Beth Coleman', initials: 'BC', job: 'Roof + gutter repair', source: 'Google', loc: 'Battlefield', received: 'Yesterday', status: 'Lost', ai: '0:58', value: 6200 },
    { id: 'L-2045', name: 'Tyler Brooks', initials: 'TB', job: 'Basement finish', source: 'Referral', loc: 'Nixa', received: '2 days ago', status: 'Quoted', ai: '0:44', value: 31500 },
  ];

  const quotes = [
    { id: '#Q-1042', client: 'Marcus Miller', job: 'Kitchen remodel', amount: 24000, status: 'Sent', ai: true, date: 'Today', viewed: true },
    { id: '#Q-1041', client: 'Dana Whitfield', job: 'Foundation repair', amount: 8600, status: 'Viewed', ai: true, date: 'Today', viewed: true },
    { id: '#Q-1040', client: 'Tyler Brooks', job: 'Basement finish', amount: 31500, status: 'Draft', ai: true, date: 'Today', viewed: false },
    { id: '#Q-1039', client: 'Carlos Reyes', job: 'Deck + concrete patio', amount: 19800, status: 'Accepted', ai: false, date: 'Yesterday', viewed: true },
    { id: '#Q-1038', client: 'Lena Park', job: 'Window replacement (12)', amount: 9400, status: 'Sent', ai: true, date: '2 days ago', viewed: false },
    { id: '#Q-1037', client: 'Grant Hollis', job: 'Siding + trim', amount: 27300, status: 'Declined', ai: false, date: '3 days ago', viewed: true },
    { id: '#Q-1036', client: 'Aisha Bello', job: 'Master suite addition', amount: 68500, status: 'Accepted', ai: true, date: '4 days ago', viewed: true },
  ];

  const jobs = {
    Scheduled: [
      { id: 'J-318', title: 'Miller kitchen remodel', client: 'Marcus Miller', when: 'Starts Mon, Jul 27', crew: ['JR', 'TS'], value: 24000, tag: 'Remodel' },
      { id: 'J-317', title: 'Park window replacement', client: 'Lena Park', when: 'Starts Wed, Jul 29', crew: ['DM'], value: 9400, tag: 'Exterior' },
    ],
    'In progress': [
      { id: 'J-314', title: 'Bello master suite addition', client: 'Aisha Bello', when: 'Day 6 of ~22', crew: ['JR', 'TS', 'DM'], value: 68500, tag: 'Addition', progress: 27 },
      { id: 'J-315', title: 'Reyes deck + patio', client: 'Carlos Reyes', when: 'Day 2 of ~7', crew: ['TS'], value: 19800, tag: 'Concrete', progress: 30 },
    ],
    Blocked: [
      { id: 'J-312', title: 'Coleman roof repair', client: 'Beth Coleman', when: 'Waiting on materials', crew: ['DM'], value: 6200, tag: 'Roofing' },
    ],
    Done: [
      { id: 'J-309', title: 'Republic bath renovation', client: 'J. Alvarez', when: 'Closed Jul 15', crew: ['JR'], value: 14200, tag: 'Remodel' },
      { id: 'J-308', title: 'Ozark garage slab', client: 'K. Foster', when: 'Closed Jul 11', crew: ['TS'], value: 7800, tag: 'Concrete' },
    ],
  };

  const invoices = [
    { id: '#1042', client: 'J. Alvarez', job: 'Republic bath renovation', amount: 14200, status: 'Paid', due: 'Jul 18', chased: false },
    { id: '#1041', client: 'K. Foster', job: 'Ozark garage slab', amount: 7800, status: 'Paid', due: 'Jul 14', chased: false },
    { id: '#1040', client: 'Aisha Bello', job: 'Suite — deposit (40%)', amount: 27400, status: 'Sent', due: 'Jul 24', chased: false },
    { id: '#1039', client: 'Carlos Reyes', job: 'Deck + patio — deposit', amount: 7920, status: 'Sent', due: 'Jul 23', chased: true },
    { id: '#1038', client: 'Grant Hollis', job: 'Siding consult fee', amount: 450, status: 'Overdue', due: 'Jul 8', chased: true },
    { id: '#1037', client: 'M. Nguyen', job: 'Fence + gate', amount: 5300, status: 'Draft', due: '—', chased: false },
  ];

  const followups = [
    { id: 'F-91', client: 'Priya Anand', re: 'Bathroom quote', when: 'Today, 4:00 PM', channel: 'SMS', seq: 'Quote nudge · step 1/3', auto: true },
    { id: 'F-90', client: 'Dana Whitfield', re: 'Foundation quote viewed', when: 'Tomorrow, 9:00 AM', channel: 'Email', seq: 'Quote nudge · step 2/3', auto: true },
    { id: 'F-89', client: 'Sam Okafor', re: 'Garage framing — first reply', when: 'Tomorrow, 8:00 AM', channel: 'SMS', seq: 'New lead · step 1/2', auto: true },
    { id: 'F-88', client: 'J. Alvarez', re: 'Leave us a review?', when: 'Fri, 10:00 AM', channel: 'Email', seq: 'Post-job · review request', auto: true },
    { id: 'F-87', client: 'Grant Hollis', re: 'Siding — re-engage', when: 'Mon, 11:00 AM', channel: 'Email', seq: 'Cold lead · win-back', auto: false },
  ];

  const activity = [
    { kind: 'ai', t: 'Quote #Q-1042 auto-drafted &amp; sent — Miller kitchen', s: 'Instant Quote · $24,000', time: '4m' },
    { kind: 'ai', t: 'Replied to new lead — Priya A., Ozark', s: 'Instant Reply · responded in 0:41', time: '2h' },
    { kind: 'ok', t: 'Invoice #1042 marked paid — Republic bath', s: 'Payments · $14,200', time: '3h' },
    { kind: 'ai', t: 'Follow-up sent — Dana W., foundation quote', s: 'Follow-up Sequence · step 1/3', time: '5h' },
    { kind: 'ai', t: 'Review request sent — J. Alvarez', s: 'Reputation · post-job', time: '6h' },
    { kind: 'ok', t: 'Job J-314 advanced to Day 6 — Bello suite', s: 'Scheduling · on track', time: '8h' },
  ];

  const kpis = {
    response:   { label: 'Avg first response', value: '0:47', unit: '', delta: -38, dir: 'up', note: 'vs 1:12 last wk', good: 'down' },
    quotes:     { label: 'Quotes sent', value: '14', unit: 'this wk', delta: 22, dir: 'up' },
    winrate:    { label: 'Win rate', value: '68', unit: '%', delta: 6, dir: 'up' },
    jobs:       { label: 'Open jobs', value: '9', unit: '', delta: 2, dir: 'up' },
    revenue:    { label: 'Revenue MTD', value: '$84.2k', unit: '', delta: 14, dir: 'up' },
    outstanding:{ label: 'Outstanding', value: '$12.4k', unit: '', delta: -9, dir: 'down' },
  };

  // pipeline distribution (leads by stage)
  const pipeline = [
    { stage: 'New', n: 12, color: 'var(--info)' },
    { stage: 'Replied', n: 9, color: 'var(--hivis)' },
    { stage: 'Quoted', n: 7, color: 'var(--warn)' },
    { stage: 'Won', n: 6, color: 'var(--ok)' },
  ];

  return { leads, quotes, jobs, invoices, followups, activity, kpis, pipeline };
})();
