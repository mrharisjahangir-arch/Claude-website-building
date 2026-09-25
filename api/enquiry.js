/**
 * POST /api/enquiry — Vercel serverless function.
 *
 * Receives an enquiry from the homepage lead form or the Get Started form and
 * adds it as a row in the "Website Enquiries" Notion database.
 *
 * Needs two environment variables, set in Vercel (never in this repo):
 *   NOTION_TOKEN        the connection's API token (ntn_...)
 *   NOTION_DATABASE_ID  the Website Enquiries database ID
 */

const NOTION_VERSION = '2022-06-28';

// Get Started form checkbox/select values -> the option names in Notion.
const INTEREST_LABELS = {
  medicine: 'Medicine (general)',
  ucat: 'UCAT',
  mmi: 'MMI & interviews',
  gcse: 'GCSE tutoring',
  alevel: 'A-Level tutoring',
  medschool: 'Medical school tutoring',
  notsure: 'Not sure'
};
const TIMEFRAME_LABELS = {
  'asap': 'As soon as possible',
  '1-3m': 'Within 1–3 months',
  '3-6m': 'Within 3–6 months',
  '6m+': '6+ months away',
  'not-sure': 'Not sure yet'
};
const SUPPORT_LABELS = { '1to1': '1-to-1', group: 'Small group', notsure: 'Not sure' };

// Extra Get Started answers, collected into the "Details" column.
const DETAIL_FIELDS = [
  ['ucatStarted', 'UCAT prep started'],
  ['ucatDate', 'UCAT test date'],
  ['ucatTarget', 'UCAT target score'],
  ['medApplying', 'Applying this cycle'],
  ['medUnis', 'Universities considering'],
  ['mmiDate', 'MMI invite'],
  ['tutYear', 'School year'],
  ['tutBoard', 'Exam board'],
  ['tutCurrent', 'Current grade'],
  ['tutTarget', 'Target grade']
];

function clean(value, max) {
  return typeof value === 'string' ? value.trim().slice(0, max || 2000) : '';
}

function text(value) {
  return { rich_text: value ? [{ text: { content: value } }] : [] };
}

function select(name) {
  return { select: name ? { name: name } : null };
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!token || !databaseId) {
    console.error('enquiry: NOTION_TOKEN or NOTION_DATABASE_ID is not set');
    return res.status(500).json({ error: 'Not configured' });
  }

  let body = req.body || {};
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { return res.status(400).json({ error: 'Invalid JSON' }); }
  }

  // Honeypot: real visitors never fill this hidden field. Pretend success for bots.
  if (clean(body.company)) return res.status(200).json({ ok: true });

  const name = clean(body.studentName || body.name, 200);
  const email = clean(body.email, 200);
  if (!name || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: 'Name and a valid email are required' });
  }

  const source = body.source === 'get-started' ? 'Get started' : 'Homepage';
  const interests = (Array.isArray(body.interests) ? body.interests : [])
    .map(function (i) { return clean(INTEREST_LABELS[i] || i, 100).replace(/,/g, ''); })
    .filter(Boolean)
    .slice(0, 20);
  const details = DETAIL_FIELDS
    .map(function (f) { const v = clean(body[f[0]], 300); return v ? f[1] + ': ' + v : ''; })
    .filter(Boolean)
    .join('\n');
  const phone = clean(body.phone, 50);

  const properties = {
    'Name': { title: [{ text: { content: name } }] },
    'Email': { email: email },
    'Phone': { phone_number: phone || null },
    'Parent name': text(clean(body.parentName, 200)),
    'Interests': { multi_select: interests.map(function (n) { return { name: n }; }) },
    'Timeframe': select(TIMEFRAME_LABELS[body.timeframe]),
    'Support type': select(SUPPORT_LABELS[body.supportType]),
    'Goals': text(clean(body.goals)),
    'Details': text(details),
    'Source': select(source),
    'Status': select('New')
  };

  try {
    const notionRes = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ parent: { database_id: databaseId }, properties: properties })
    });
    if (!notionRes.ok) {
      console.error('enquiry: Notion returned', notionRes.status, await notionRes.text());
      return res.status(502).json({ error: 'Could not save enquiry' });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('enquiry: request to Notion failed', err);
    return res.status(502).json({ error: 'Could not save enquiry' });
  }
};
