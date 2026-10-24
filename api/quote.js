const {randomUUID} = require('node:crypto');
module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({error:'Use POST.'}); }
  let data;
  try { data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body; } catch { return res.status(400).json({error:'Invalid request.'}); }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return res.status(400).json({error:'Invalid request.'});
  if (data.website) return res.status(400).json({error:'Invalid request.'});
  const limits = {name:100,phone:18,email:254,org:150,service:150,deadline:10,requirement:3000};
  const quote = {};
  for (const [key,max] of Object.entries(limits)) {
    const value = data[key] ?? '';
    if (typeof value !== 'string' || value.length > max) return res.status(400).json({error:'Please check your enquiry details.'});
    quote[key] = value.trim();
  }
  if (!quote.name || !quote.service || !quote.requirement || !/^[+0-9 ()-]{10,18}$/.test(quote.phone) || quote.phone.replace(/\D/g,'').length < 10 || (quote.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(quote.email)) || (quote.deadline && !/^\d{4}-\d{2}-\d{2}$/.test(quote.deadline))) return res.status(400).json({error:'Please enter a valid name, phone number and requirement.'});
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const token = process.env.GOOGLE_SHEETS_WEBHOOK_TOKEN;
  if (!url || !/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(url) || !token) return res.status(503).json({error:'Online enquiries are being connected. Please send your details on WhatsApp for now.'});
  const id = typeof data.requestId === 'string' && /^[a-f0-9-]{36}$/i.test(data.requestId) ? data.requestId : randomUUID();
  try {
    const response = await fetch(url, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...quote,requestId:id,token}),signal:AbortSignal.timeout(20000)});
    const result = await response.json();
    if (!response.ok || result.ok !== true || result.requestId !== id) throw new Error('Unconfirmed write');
    return res.status(200).json({ok:true,requestId:id});
  } catch {
    return res.status(502).json({error:'We could not confirm your enquiry was saved. Please retry with the same details or contact us on WhatsApp.'});
  }
};
