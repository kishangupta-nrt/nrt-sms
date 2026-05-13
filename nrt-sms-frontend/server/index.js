import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = 5000;
const JWT_SECRET = 'nrt-sms-mock-secret-key';

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const AUTH_USER = {
  id: 1,
  username: 'BhanusamajAarogyam',
  password: 'Newrise_64554',
  fullName: 'Bhanu Samaj Aarogyam',
  email: 'admin@bhanusamaj.org',
  role: 'admin',
  avatar: null,
  ability: [{ action: 'manage', subject: 'all' }],
};

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function generateToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
}

function paginate(arr, page = 1, perPage = 10) {
  const start = (page - 1) * perPage;
  return { data: arr.slice(start, start + perPage), total: arr.length };
}

/* ───── MOCK DATA ───── */

const smsRecords = Array.from({ length: 50 }, (_, i) => ({
  id: uuidv4(), mobile: `987654${String(3210 + i).padStart(4, '0')}`,
  message: ['Your OTP is 456789', 'Payment received successfully', 'Appointment reminder for tomorrow', 'Your order has been shipped', 'Welcome to our service!'][i % 5],
  senderId: ['NRT-SMS', 'NRT-INFO', 'NRT-ALERT'][i % 3],
  status: ['Delivered', 'Delivered', 'Pending', 'Failed', 'Delivered'][i % 5],
  date: new Date(Date.now() - i * 3600000).toISOString(), credits: i % 5 === 3 ? 0 : 1,
}));

const dltTemplates = [
  { id: '1107161794229451901', entityId: '1101554900001046901', header: 'NRT-SMS', content: 'Your OTP for verification is {#var#}', status: 'Approved', dltStatus: 'Active' },
  { id: '1107161794229451902', entityId: '1101554900001046901', header: 'NRT-INFO', content: 'Dear {#var#}, your order {#var#} has been shipped.', status: 'Pending', dltStatus: 'Inactive' },
  { id: '1107161794229451903', entityId: '1101554900001046901', header: 'NRT-ALERT', content: 'Payment of Rs.{#var#} received successfully.', status: 'Approved', dltStatus: 'Active' },
  { id: '1107161794229451904', entityId: '1101554900001046902', header: 'NRT-SMS', content: 'Dear {#var#}, your appointment is confirmed for {#var#}.', status: 'Approved', dltStatus: 'Active' },
];

const senderIds = [
  { id: '1', senderId: 'NRT-SMS', status: 'Approved', created: '01 Jan 2026' },
  { id: '2', senderId: 'NRT-INFO', status: 'Approved', created: '15 Feb 2026' },
  { id: '3', senderId: 'NRT-ALERT', status: 'Pending', created: '10 Mar 2026' },
];

const contacts = [
  { id: '1', name: 'Rahul Sharma', mobile: '9876543210', email: 'rahul@email.com', group: 'Customers' },
  { id: '2', name: 'Priya Patel', mobile: '9876543211', email: 'priya@email.com', group: 'Customers' },
  { id: '3', name: 'Amit Singh', mobile: '9876543212', email: 'amit@email.com', group: 'Employees' },
  { id: '4', name: 'Sneha Reddy', mobile: '9876543213', email: 'sneha@email.com', group: 'Vendors' },
  { id: '5', name: 'Vikram Joshi', mobile: '9876543214', email: 'vikram@email.com', group: 'Customers' },
];

const contactGroups = [
  { id: '1', name: 'Customers', count: 245, created: '01 Jan 2026' },
  { id: '2', name: 'Employees', count: 89, created: '15 Jan 2026' },
  { id: '3', name: 'Vendors', count: 56, created: '20 Feb 2026' },
  { id: '4', name: 'Newsletter', count: 1200, created: '01 Mar 2026' },
];

const campaigns = [
  { id: '1', name: 'Summer Sale 2026', type: 'SMS', status: 'Completed', sent: 1500, total: 1500, date: '10 May 2026' },
  { id: '2', name: 'Appointment Reminders', type: 'WhatsApp', status: 'Running', sent: 342, total: 500, date: '12 May 2026' },
  { id: '3', name: 'Festival Greetings', type: 'SMS', status: 'Scheduled', sent: 0, total: 2000, date: '20 May 2026' },
  { id: '4', name: 'Product Launch', type: 'WhatsApp', status: 'Draft', sent: 0, total: 1000, date: '25 May 2026' },
  { id: '5', name: 'Feedback Survey', type: 'SMS', status: 'Running', sent: 678, total: 1000, date: '11 May 2026' },
];

const waTemplates = [
  { id: '1', name: 'Welcome Message', category: 'Marketing', status: 'Approved', language: 'English', created: '10 May 2026' },
  { id: '2', name: 'OTP Verification', category: 'Utility', status: 'Approved', language: 'English', created: '08 May 2026' },
  { id: '3', name: 'Order Confirmation', category: 'Marketing', status: 'Pending', language: 'English', created: '05 May 2026' },
  { id: '4', name: 'Appointment Reminder', category: 'Utility', status: 'Approved', language: 'Hindi', created: '01 May 2026' },
];

const waConfigs = [
  { id: '1', name: 'Production App', phone: '919876543210', status: 'Connected', provider: 'Meta', businessId: '123456789' },
  { id: '2', name: 'Test App', phone: '919876543211', status: 'Disconnected', provider: 'Meta', businessId: '987654321' },
];

const users = [
  { id: 1, username: 'BhanusamajAarogyam', fullName: 'Bhanu Samaj Aarogyam', email: 'admin@bhanusamaj.org', role: 'Admin', status: 'Active', credits: 50000, mobile: '9876543200' },
  { id: 2, username: 'manager', fullName: 'Manager User', email: 'manager@demo.com', role: 'Manager', status: 'Active', credits: 25000, mobile: '9876543201' },
  { id: 3, username: 'operator', fullName: 'Operator User', email: 'operator@demo.com', role: 'Operator', status: 'Active', credits: 10000, mobile: '9876543202' },
  { id: 4, username: 'viewer', fullName: 'Viewer User', email: 'viewer@demo.com', role: 'Viewer', status: 'Inactive', credits: 0, mobile: '9876543203' },
];

const roles = [
  { id: 1, name: 'Admin', users: 3, permissions: ['All Permissions'], created: '01 Jan 2026' },
  { id: 2, name: 'Manager', users: 5, permissions: ['Send SMS', 'View Reports', 'Manage Templates'], created: '15 Jan 2026' },
  { id: 3, name: 'Operator', users: 8, permissions: ['Send SMS', 'View Reports'], created: '01 Feb 2026' },
  { id: 4, name: 'Viewer', users: 12, permissions: ['View Reports'], created: '01 Mar 2026' },
];

const blacklist = [
  { id: '1', mobile: '9876543000', reason: 'Spam', added: '01 Mar 2026' },
  { id: '2', mobile: '9876543001', reason: 'Opt-out', added: '15 Mar 2026' },
];

const twoWayMessages = [
  { id: '1', mobile: '9876543210', message: 'Yes, I am interested', direction: 'Incoming', date: '13 May 2026', status: 'Read' },
  { id: '2', mobile: '9876543211', message: 'Please send details', direction: 'Incoming', date: '13 May 2026', status: 'Read' },
  { id: '3', mobile: '9876543212', message: 'Your query has been resolved', direction: 'Outgoing', date: '12 May 2026', status: 'Sent' },
];

const appSettings = {
  defaultSenderId: 'NRT-SMS',
  defaultTemplate: '',
  enableTwoWay: true,
  autoDeliveryReport: true,
  apiUrl: 'http://localhost:5000/api/',
  username: AUTH_USER.username,
};

/* ───── AUTH ENDPOINTS ───── */

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === AUTH_USER.username && password === AUTH_USER.password) {
    const { password: _, ...userWithoutPassword } = AUTH_USER;
    const token = generateToken(AUTH_USER);
    return res.json({ user: userWithoutPassword, token });
  }
  return res.status(400).json({ error: 'Invalid username or password' });
});

app.post('/api/jwt/login', (req, res) => {
  const { email, password } = req.body;
  if (email === AUTH_USER.email && password === AUTH_USER.password) {
    const { password: _, ...userWithoutPassword } = AUTH_USER;
    const token = generateToken(AUTH_USER);
    const refreshToken = jwt.sign({ id: AUTH_USER.id }, JWT_SECRET + '-refresh', { expiresIn: '7d' });
    return res.json({ userData: userWithoutPassword, accessToken: token, refreshToken });
  }
  return res.status(400).json({ error: { email: ['Email or Password is Invalid'] } });
});

app.post('/api/jwt/register', (req, res) => {
  const { email, password, username } = req.body;
  const existing = users.find(u => u.email === email || u.username === username);
  if (existing) {
    return res.json({ error: { email: existing.email === email ? 'This email is already in use.' : undefined, username: existing.username === username ? 'This username is already in use.' : undefined } });
  }
  const newUser = { id: users.length + 1, username, email, fullName: '', role: 'Admin', status: 'Active', credits: 0, mobile: '', ability: [{ action: 'manage', subject: 'all' }] };
  users.push(newUser);
  const token = generateToken(newUser);
  return res.json({ user: newUser, accessToken: token });
});

app.post('/api/jwt/refresh-token', (req, res) => {
  const { refreshToken } = req.body;
  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET + '-refresh');
    const user = users.find(u => u.id === decoded.id);
    if (!user) return res.status(401).json({ error: 'Invalid refresh token' });
    const newToken = generateToken(user);
    const newRefresh = jwt.sign({ id: user.id }, JWT_SECRET + '-refresh', { expiresIn: '7d' });
    return res.json({ userData: user, accessToken: newToken, refreshToken: newRefresh });
  } catch { return res.status(401).json({ error: 'Invalid refresh token' }); }
});

/* ───── DATATABLES ───── */

app.get('/api/datatables/data', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  const type = req.query.type;
  if (type === 'sms') return res.json(paginate(smsRecords, page, perPage));
  if (type === 'dlt') return res.json(paginate(dltTemplates, page, perPage));
  if (type === 'sender') return res.json(paginate(senderIds, page, perPage));
  if (type === 'contacts') return res.json(paginate(contacts, page, perPage));
  return res.json(paginate(smsRecords, page, perPage));
});

app.get('/api/datatables/initial-data', (req, res) => {
  res.json({ sms: smsRecords.slice(0, 10), total: smsRecords.length });
});

/* ───── SMS ───── */

app.post('/api/send-sms', authMiddleware, (req, res) => {
  const { mobile, message, senderId } = req.body;
  const numbers = mobile.split('\n').filter(Boolean);
  const records = numbers.map(m => ({
    id: uuidv4(), mobile: m.trim(), message, senderId: senderId || 'NRT-SMS',
    status: 'Sent', date: new Date().toISOString(), credits: 1,
  }));
  smsRecords.unshift(...records);
  res.json({ success: true, message: 'SMS sent successfully', count: records.length });
});

app.get('/api/campaign-list', authMiddleware, (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  res.json(paginate(campaigns, page, perPage));
});

app.get('/api/get-campaign-info/:id', authMiddleware, (req, res) => {
  const c = smsRecords.find(r => r.id === req.params.id);
  res.json(c || { error: 'Campaign not found' });
});

app.post('/api/repush-campaign', authMiddleware, (req, res) => {
  res.json({ success: true, message: 'Campaign resent' });
});

app.get('/api/scheduled-campaign-report', authMiddleware, (req, res) => {
  res.json({ data: [], total: 0 });
});

app.delete('/api/campaign/:id', authMiddleware, (req, res) => {
  const idx = campaigns.findIndex(x => x.id === req.params.id);
  if (idx > -1) { campaigns.splice(idx, 1); return res.json({ success: true }); }
  res.status(404).json({ error: 'Not found' });
});

/* ───── TWO-WAY SMS ───── */

app.get('/api/two-ways-smses', authMiddleware, (req, res) => {
  const page = parseInt(req.query.page) || 1;
  res.json(paginate(twoWayMessages, page, 10));
});

app.post('/api/two-ways-sms', authMiddleware, (req, res) => {
  const record = { id: uuidv4(), ...req.body, direction: 'Outgoing', date: new Date().toISOString(), status: 'Sent' };
  twoWayMessages.unshift(record);
  res.json({ success: true, data: record });
});

app.get('/api/two-ways-sms/:id', authMiddleware, (req, res) => {
  const r = twoWayMessages.find(m => m.id === req.params.id);
  res.json(r || { error: 'Not found' });
});

app.put('/api/two-ways-sms/:id', authMiddleware, (req, res) => {
  const idx = twoWayMessages.findIndex(m => m.id === req.params.id);
  if (idx > -1) { twoWayMessages[idx] = { ...twoWayMessages[idx], ...req.body }; return res.json(twoWayMessages[idx]); }
  res.status(404).json({ error: 'Not found' });
});

app.delete('/api/two-ways-sms/:id', authMiddleware, (req, res) => {
  const idx = twoWayMessages.findIndex(m => m.id === req.params.id);
  if (idx > -1) { twoWayMessages.splice(idx, 1); return res.json({ success: true }); }
  res.status(404).json({ error: 'Not found' });
});

/* ───── DLT TEMPLATES ───── */

app.get('/api/dlt-templates', authMiddleware, (req, res) => {
  const page = parseInt(req.query.page) || 1;
  res.json(paginate(dltTemplates, page, 10));
});

app.post('/api/dlt-template', authMiddleware, (req, res) => {
  const t = { id: uuidv4(), ...req.body, dltStatus: 'Inactive' };
  dltTemplates.push(t);
  res.json({ success: true, data: t });
});

app.get('/api/dlt-template/:id', authMiddleware, (req, res) => {
  const t = dltTemplates.find(d => d.id === req.params.id);
  res.json(t || { error: 'Not found' });
});

app.put('/api/dlt-template/:id', authMiddleware, (req, res) => {
  const idx = dltTemplates.findIndex(d => d.id === req.params.id);
  if (idx > -1) { dltTemplates[idx] = { ...dltTemplates[idx], ...req.body }; return res.json(dltTemplates[idx]); }
  res.status(404).json({ error: 'Not found' });
});

app.delete('/api/dlt-template/:id', authMiddleware, (req, res) => {
  const idx = dltTemplates.findIndex(d => d.id === req.params.id);
  if (idx > -1) { dltTemplates.splice(idx, 1); return res.json({ success: true }); }
  res.status(404).json({ error: 'Not found' });
});

app.post('/api/dlt-templates-assign-to-users', authMiddleware, (req, res) => res.json({ success: true }));
app.post('/api/dlt-templates-import', authMiddleware, (req, res) => res.json({ success: true, count: 5 }));

/* ───── DLT GROUPS ───── */

app.get('/api/dlt-template-groups', authMiddleware, (req, res) => res.json({ data: [], total: 0 }));
app.post('/api/dlt-template-group', authMiddleware, (req, res) => res.json({ success: true }));
app.get('/api/dlt-template-group/:id', authMiddleware, (req, res) => res.json({}));
app.put('/api/dlt-template-group/:id', authMiddleware, (req, res) => res.json({ success: true }));
app.delete('/api/dlt-template-group/:id', authMiddleware, (req, res) => res.json({ success: true }));

/* ───── SENDER ID ───── */

app.get('/api/manage-sender-ids', authMiddleware, (req, res) => {
  const page = parseInt(req.query.page) || 1;
  res.json(paginate(senderIds, page, 10));
});

app.post('/api/manage-sender-id', authMiddleware, (req, res) => {
  const s = { id: uuidv4(), ...req.body, status: 'Pending', created: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) };
  senderIds.push(s);
  res.json({ success: true, data: s });
});

app.get('/api/manage-sender-id/:id', authMiddleware, (req, res) => {
  const s = senderIds.find(x => x.id === req.params.id);
  res.json(s || { error: 'Not found' });
});

app.put('/api/manage-sender-id/:id', authMiddleware, (req, res) => {
  const idx = senderIds.findIndex(x => x.id === req.params.id);
  if (idx > -1) { senderIds[idx] = { ...senderIds[idx], ...req.body }; return res.json(senderIds[idx]); }
  res.status(404).json({ error: 'Not found' });
});

app.delete('/api/manage-sender-id/:id', authMiddleware, (req, res) => {
  const idx = senderIds.findIndex(x => x.id === req.params.id);
  if (idx > -1) { senderIds.splice(idx, 1); return res.json({ success: true }); }
  res.status(404).json({ error: 'Not found' });
});

app.post('/api/sender-id-action', authMiddleware, (req, res) => res.json({ success: true }));

/* ───── CONTACTS ───── */

app.get('/api/contact-numbers', authMiddleware, (req, res) => {
  const page = parseInt(req.query.page) || 1;
  res.json(paginate(contacts, page, 10));
});

app.post('/api/contact-number', authMiddleware, (req, res) => {
  const c = { id: uuidv4(), ...req.body };
  contacts.push(c);
  res.json({ success: true, data: c });
});

app.get('/api/contact-number/:id', authMiddleware, (req, res) => {
  const c = contacts.find(x => x.id === req.params.id);
  res.json(c || { error: 'Not found' });
});

app.put('/api/contact-number/:id', authMiddleware, (req, res) => {
  const idx = contacts.findIndex(x => x.id === req.params.id);
  if (idx > -1) { contacts[idx] = { ...contacts[idx], ...req.body }; return res.json(contacts[idx]); }
  res.status(404).json({ error: 'Not found' });
});

app.delete('/api/contact-number/:id', authMiddleware, (req, res) => {
  const idx = contacts.findIndex(x => x.id === req.params.id);
  if (idx > -1) { contacts.splice(idx, 1); return res.json({ success: true }); }
  res.status(404).json({ error: 'Not found' });
});

app.post('/api/contact-numbers-import', authMiddleware, (req, res) => res.json({ success: true, count: 25 }));

/* ───── CONTACT GROUPS ───── */

app.get('/api/contact-groups', authMiddleware, (req, res) => {
  res.json({ data: contactGroups, total: contactGroups.length });
});

app.post('/api/contact-group', authMiddleware, (req, res) => {
  const g = { id: uuidv4(), ...req.body, count: 0, created: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) };
  contactGroups.push(g);
  res.json({ success: true, data: g });
});

app.put('/api/contact-group/:id', authMiddleware, (req, res) => {
  const idx = contactGroups.findIndex(x => x.id === req.params.id);
  if (idx > -1) { contactGroups[idx] = { ...contactGroups[idx], ...req.body }; return res.json(contactGroups[idx]); }
  res.status(404).json({ error: 'Not found' });
});

app.delete('/api/contact-group/:id', authMiddleware, (req, res) => {
  const idx = contactGroups.findIndex(x => x.id === req.params.id);
  if (idx > -1) { contactGroups.splice(idx, 1); return res.json({ success: true }); }
  res.status(404).json({ error: 'Not found' });
});

/* ───── WHATSAPP TEMPLATES ───── */

app.get('/api/wa-templates', authMiddleware, (req, res) => res.json({ data: waTemplates, total: waTemplates.length }));
app.post('/api/wa-template', authMiddleware, (req, res) => {
  const t = { id: uuidv4(), ...req.body, status: 'Pending', created: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) };
  waTemplates.push(t);
  res.json({ success: true, data: t });
});
app.get('/api/wa-template/:id', authMiddleware, (req, res) => {
  const t = waTemplates.find(x => x.id === req.params.id);
  res.json(t || { error: 'Not found' });
});
app.put('/api/wa-template/:id', authMiddleware, (req, res) => {
  const idx = waTemplates.findIndex(x => x.id === req.params.id);
  if (idx > -1) { waTemplates[idx] = { ...waTemplates[idx], ...req.body }; return res.json(waTemplates[idx]); }
  res.status(404).json({ error: 'Not found' });
});
app.delete('/api/wa-template/:id', authMiddleware, (req, res) => {
  const idx = waTemplates.findIndex(x => x.id === req.params.id);
  if (idx > -1) { waTemplates.splice(idx, 1); return res.json({ success: true }); }
  res.status(404).json({ error: 'Not found' });
});
app.post('/api/wa-pull-template', authMiddleware, (req, res) => res.json({ success: true }));
app.post('/api/wa-pull-all-template', authMiddleware, (req, res) => res.json({ success: true }));

/* ───── WHATSAPP CONFIG ───── */

app.get('/api/wa-account-configurations', authMiddleware, (req, res) => res.json({ data: waConfigs, total: waConfigs.length }));
app.post('/api/wa-account-configuration', authMiddleware, (req, res) => {
  const c = { id: uuidv4(), ...req.body, status: 'Disconnected' };
  waConfigs.push(c);
  res.json({ success: true, data: c });
});
app.get('/api/wa-account-configuration/:id', authMiddleware, (req, res) => {
  const c = waConfigs.find(x => x.id === req.params.id);
  res.json(c || { error: 'Not found' });
});
app.put('/api/wa-account-configuration/:id', authMiddleware, (req, res) => {
  const idx = waConfigs.findIndex(x => x.id === req.params.id);
  if (idx > -1) { waConfigs[idx] = { ...waConfigs[idx], ...req.body }; return res.json(waConfigs[idx]); }
  res.status(404).json({ error: 'Not found' });
});
app.delete('/api/wa-account-configuration/:id', authMiddleware, (req, res) => {
  const idx = waConfigs.findIndex(x => x.id === req.params.id);
  if (idx > -1) { waConfigs.splice(idx, 1); return res.json({ success: true }); }
  res.status(404).json({ error: 'Not found' });
});

/* ───── WHATSAPP SEND ───── */

app.post('/api/wa-send-message', authMiddleware, (req, res) => {
  res.json({ success: true, message: 'WhatsApp message sent', id: uuidv4() });
});
app.get('/api/wa-campaigns', authMiddleware, (req, res) => res.json({ data: [], total: 0 }));
app.get('/api/wa-get-campaign-info/:id', authMiddleware, (req, res) => res.json({}));

/* ───── WHATSAPP QR / MEDIA ───── */

app.get('/api/wa-qrcodes', authMiddleware, (req, res) => res.json({ data: [], total: 0 }));
app.post('/api/wa-qrcode', authMiddleware, (req, res) => res.json({ success: true }));
app.delete('/api/wa-qrcode/:id', authMiddleware, (req, res) => res.json({ success: true }));
app.get('/api/wa-files', authMiddleware, (req, res) => res.json({ data: [], total: 0 }));
app.post('/api/wa-file', authMiddleware, (req, res) => res.json({ success: true }));
app.delete('/api/wa-file/:id', authMiddleware, (req, res) => res.json({ success: true }));
app.post('/api/wa-file-upload', authMiddleware, (req, res) => res.json({ success: true, file: 'uploaded' }));
app.post('/api/wa-charges', authMiddleware, (req, res) => res.json({ data: [], total: 0 }));

/* ───── REPORTS ───── */

app.get('/api/delivery-report', authMiddleware, (req, res) => {
  const page = parseInt(req.query.page) || 1;
  res.json(paginate(smsRecords, page, 10));
});

app.get('/api/detailed-report', authMiddleware, (req, res) => {
  const page = parseInt(req.query.page) || 1;
  res.json(paginate(smsRecords.map((r, i) => ({ ...r, id: i + 1, dltTemplate: dltTemplates[i % dltTemplates.length]?.id })), page, 10));
});

app.get('/api/overview-report-by-user', authMiddleware, (req, res) => {
  res.json({ sent: 125423, delivered: 118902, failed: 3421, pending: 3100, total: 125423 });
});

app.get('/api/msg-consumption-report', authMiddleware, (req, res) => res.json({ data: [], total: 0 }));
app.get('/api/month-wise-submission-report', authMiddleware, (req, res) => res.json({ data: [], total: 0 }));
app.get('/api/consumption-report-by-view', authMiddleware, (req, res) => res.json({ data: [], total: 0 }));
app.get('/api/report-by-mobile', authMiddleware, (req, res) => res.json({ data: [], total: 0 }));
app.get('/api/get-report-by-time-frame', authMiddleware, (req, res) => res.json({ data: [], total: 0 }));

/* ───── REPORTS ───── */

app.get('/api/export-sms-report', authMiddleware, (req, res) => res.json({ url: '/downloads/report.csv' }));

/* ───── USERS ───── */

app.get('/api/users', authMiddleware, (req, res) => {
  const page = parseInt(req.query.page) || 1;
  res.json(paginate(users, page, 10));
});

app.get('/api/users-for-ddl', authMiddleware, (req, res) => res.json(users.map(u => ({ id: u.id, username: u.username, fullName: u.fullName }))));

app.post('/api/user', authMiddleware, (req, res) => {
  const u = { id: users.length + 1, ...req.body, status: 'Active', credits: 0 };
  users.push(u);
  res.json({ success: true, data: u });
});

app.get('/api/user/:id', authMiddleware, (req, res) => {
  const u = users.find(x => x.id === parseInt(req.params.id));
  res.json(u || { error: 'Not found' });
});

app.put('/api/user/:id', authMiddleware, (req, res) => {
  const idx = users.findIndex(x => x.id === parseInt(req.params.id));
  if (idx > -1) { users[idx] = { ...users[idx], ...req.body }; return res.json(users[idx]); }
  res.status(404).json({ error: 'Not found' });
});

app.delete('/api/user/:id', authMiddleware, (req, res) => {
  const idx = users.findIndex(x => x.id === parseInt(req.params.id));
  if (idx > -1) { users.splice(idx, 1); return res.json({ success: true }); }
  res.status(404).json({ error: 'Not found' });
});

app.post('/api/user-action', authMiddleware, (req, res) => res.json({ success: true }));
app.post('/api/update-profile', authMiddleware, (req, res) => res.json({ success: true }));
app.post('/api/update-self-password', authMiddleware, (req, res) => res.json({ success: true }));
app.post('/api/reset-user-password', authMiddleware, (req, res) => res.json({ success: true }));
app.post('/api/user-change-api-key', authMiddleware, (req, res) => res.json({ success: true, apiKey: uuidv4() }));

/* ───── CREDITS ───── */

app.get('/api/user-credits', authMiddleware, (req, res) => res.json({ data: [{ id: '1', amount: 50000, type: 'Credit', date: '01 Jan 2026', note: 'Initial balance' }], total: 1 }));
app.post('/api/user-credit', authMiddleware, (req, res) => res.json({ success: true }));
app.get('/api/credit-requests', authMiddleware, (req, res) => res.json({ data: [], total: 0 }));
app.post('/api/credit-request', authMiddleware, (req, res) => res.json({ success: true }));

/* ───── BLACKLIST ───── */

app.get('/api/blacklists', authMiddleware, (req, res) => res.json(paginate(blacklist, parseInt(req.query.page) || 1, 10)));
app.post('/api/blacklist', authMiddleware, (req, res) => {
  const b = { id: uuidv4(), ...req.body, added: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) };
  blacklist.push(b);
  res.json({ success: true, data: b });
});
app.delete('/api/blacklist/:id', authMiddleware, (req, res) => {
  const idx = blacklist.findIndex(x => x.id === req.params.id);
  if (idx > -1) { blacklist.splice(idx, 1); return res.json({ success: true }); }
  res.status(404).json({ error: 'Not found' });
});
app.post('/api/blacklists-import', authMiddleware, (req, res) => res.json({ success: true, count: 10 }));

/* ───── ROLES ───── */

app.get('/api/roles', authMiddleware, (req, res) => res.json({ data: roles, total: roles.length }));
app.post('/api/role', authMiddleware, (req, res) => {
  const r = { id: roles.length + 1, ...req.body, users: 0 };
  roles.push(r);
  res.json({ success: true, data: r });
});
app.put('/api/role/:id', authMiddleware, (req, res) => {
  const idx = roles.findIndex(x => x.id === parseInt(req.params.id));
  if (idx > -1) { roles[idx] = { ...roles[idx], ...req.body }; return res.json(roles[idx]); }
  res.status(404).json({ error: 'Not found' });
});
app.delete('/api/role/:id', authMiddleware, (req, res) => {
  const idx = roles.findIndex(x => x.id === parseInt(req.params.id));
  if (idx > -1) { roles.splice(idx, 1); return res.json({ success: true }); }
  res.status(404).json({ error: 'Not found' });
});
app.get('/api/get-all-permissions', authMiddleware, (req, res) => {
  const perms = [{ action: 'manage', subject: 'all' }, { action: 'read', subject: 'all' }, { action: 'send', subject: 'sms' }, { action: 'read', subject: 'reports' }];
  res.json(perms);
});

/* ───── SETTINGS ───── */

app.get('/api/get-app-setting', authMiddleware, (req, res) => res.json(appSettings));
app.post('/api/administration/app-setting-update', authMiddleware, (req, res) => {
  Object.assign(appSettings, req.body);
  res.json({ success: true });
});
app.get('/api/server-info', authMiddleware, (req, res) => res.json({ name: 'NRT-SMS Server', version: '2.0.0', uptime: process.uptime() }));
app.get('/api/public-app-setting', (req, res) => res.json({ appName: 'NRT-SMS', version: '2.0.0' }));

/* ───── NOTIFICATIONS ───── */

app.get('/api/notifications', authMiddleware, (req, res) => res.json({ data: [], total: 0 }));
app.get('/api/unread-notification-count', authMiddleware, (req, res) => res.json({ count: 0 }));
app.get('/api/notification/:id', authMiddleware, (req, res) => res.json({}));
app.post('/api/notification-read/:id', authMiddleware, (req, res) => res.json({ success: true }));
app.post('/api/user-notification-read-all', authMiddleware, (req, res) => res.json({ success: true }));

/* ───── ADMIN ENDPOINTS ───── */

app.get('/api/administration/all-countries', authMiddleware, (req, res) => res.json({ data: [{ id: 1, name: 'India', code: 'IN' }, { id: 2, name: 'USA', code: 'US' }], total: 2 }));
app.get('/api/administration/get-daily-report', authMiddleware, (req, res) => res.json({ data: [], total: 0 }));
app.get('/api/administration/get-current-kannel-status', authMiddleware, (req, res) => res.json({ status: 'running' }));
app.post('/api/administration/server-commands', authMiddleware, (req, res) => res.json({ success: true }));
app.post('/api/administration/manage-campaign', authMiddleware, (req, res) => res.json({ success: true }));

/* ───── API KEYS / DOCUMENTS ───── */

app.get('/api/administration/documents', authMiddleware, (req, res) => res.json({ data: [], total: 0 }));
app.post('/api/administration/document', authMiddleware, (req, res) => res.json({ success: true }));
app.get('/api/administration/document/:id', authMiddleware, (req, res) => res.json({}));
app.put('/api/administration/document/:id', authMiddleware, (req, res) => res.json({ success: true }));
app.delete('/api/administration/document/:id', authMiddleware, (req, res) => res.json({ success: true }));

/* ───── IP WHITELIST ───── */

app.get('/api/ip-white-list-for-apis', authMiddleware, (req, res) => res.json({ data: [], total: 0 }));
app.post('/api/ip-white-list-for-api', authMiddleware, (req, res) => res.json({ success: true }));
app.delete('/api/ip-white-list-for-api/:id', authMiddleware, (req, res) => res.json({ success: true }));

/* ───── DLR ───── */

app.get('/api/administration/dlrcode-list', authMiddleware, (req, res) => res.json({ data: [], total: 0 }));
app.post('/api/administration/dlrcode', authMiddleware, (req, res) => res.json({ success: true }));
app.get('/api/administration/dlrcode/:id', authMiddleware, (req, res) => res.json({}));
app.put('/api/administration/dlrcode/:id', authMiddleware, (req, res) => res.json({ success: true }));
app.delete('/api/administration/dlrcode/:id', authMiddleware, (req, res) => res.json({ success: true }));
app.post('/api/administration/dlrcode-action', authMiddleware, (req, res) => res.json({ success: true }));

/* ───── SECONDARY ROUTES ───── */

app.get('/api/administration/secondary-routes', authMiddleware, (req, res) => res.json({ data: [], total: 0 }));
app.post('/api/administration/secondary-route', authMiddleware, (req, res) => res.json({ success: true }));
app.put('/api/administration/secondary-route/:id', authMiddleware, (req, res) => res.json({ success: true }));
app.delete('/api/administration/secondary-route/:id', authMiddleware, (req, res) => res.json({ success: true }));

/* ───── VOICE SMS ───── */

app.post('/api/voice-sms', authMiddleware, (req, res) => res.json({ success: true }));
app.get('/api/voice-campaign-list', authMiddleware, (req, res) => res.json({ data: [], total: 0 }));
app.post('/api/voice-upload', authMiddleware, (req, res) => res.json({ success: true }));
app.get('/api/voice-file-list', authMiddleware, (req, res) => res.json({ data: [], total: 0 }));

/* ───── BOOKMARKS & SEARCH ───── */

app.get('/api/bookmarks/data', (req, res) => res.json({ suggestions: [], bookmarks: [] }));
app.post('/api/bookmarks/update', (req, res) => res.json({ success: true }));
app.get('/api/main-search/data', (req, res) => res.json({ data: [], total: 0 }));
app.get('/api/autocomplete/data', (req, res) => res.json({ data: [], total: 0 }));
app.get('/api/select/data', (req, res) => res.json({ data: [], total: 0 }));
app.get('/api/invoice/clients', (req, res) => res.json({ data: [], total: 0 }));
app.get('/api/users/list/all-data', (req, res) => res.json({ data: [], total: 0 }));
app.get('/api/users/list/data', (req, res) => res.json({ data: [], total: 0 }));
app.get('/api/users/user', authMiddleware, (req, res) => {
  const { password: _, ...user } = AUTH_USER;
  res.json(user);
});

/* ───── SCHEDULED REPORT ───── */

app.get('/api/scheduled-campaign-report', authMiddleware, (req, res) => res.json({ data: [], total: 0 }));

/* ───── SAMPLE DOWNLOADS ───── */

app.get('/api/sample-download/contacts', (req, res) => {
  const csv = 'Name,Mobile,Email,Group\n"Rahul Sharma",9876543210,rahul@email.com,Customers\n"Priya Patel",9876543211,priya@email.com,Customers\n"Amit Singh",9876543212,amit@email.com,Employees\n';
  res.setHeader('Content-Type', 'text/csv;charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename=sample-contacts.csv');
  res.send('\uFEFF' + csv);
});

app.get('/api/sample-download/dlt', (req, res) => {
  const csv = 'Template ID,Entity ID,Header,Content\nTMP001,ENT001,NRT-SMS,"Your OTP for verification is {#var#}"\nTMP002,ENT001,NRT-INFO,"Dear {#var#}, your order {#var#} has been shipped."\n';
  res.setHeader('Content-Type', 'text/csv;charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename=sample-dlt-templates.csv');
  res.send('\uFEFF' + csv);
});

app.get('/api/sample-download/sender-ids', (req, res) => {
  const csv = 'Sender ID\nNRT-SMS\nNRT-INFO\nNRT-ALERT\n';
  res.setHeader('Content-Type', 'text/csv;charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename=sample-sender-ids.csv');
  res.send('\uFEFF' + csv);
});

/* ───── HEALTH CHECK ───── */

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

/* ───── ADMIN ROUTES ───── */

app.get('/api/administration/notification-templates', authMiddleware, (req, res) => res.json({ data: [], total: 0 }));
app.post('/api/administration/notification-template', authMiddleware, (req, res) => res.json({ success: true }));
app.put('/api/administration/notification-template/:id', authMiddleware, (req, res) => res.json({ success: true }));
app.delete('/api/administration/notification-template/:id', authMiddleware, (req, res) => res.json({ success: true }));
app.get('/api/administration/user-wise-monthly-reports', authMiddleware, (req, res) => res.json({ data: [], total: 0 }));
app.get('/api/administration/invalid-series-list', authMiddleware, (req, res) => res.json({ data: [], total: 0 }));
app.post('/api/administration/invalid-series', authMiddleware, (req, res) => res.json({ success: true }));
app.delete('/api/administration/invalid-series/:id', authMiddleware, (req, res) => res.json({ success: true }));
app.post('/api/administration/assign-route-to-user', authMiddleware, (req, res) => res.json({ success: true }));
app.post('/api/administration/set-user-ratio', authMiddleware, (req, res) => res.json({ success: true }));
app.post('/api/administration/bulk-voice-file-action', authMiddleware, (req, res) => res.json({ success: true }));
app.post('/api/administration/voice-file-process', authMiddleware, (req, res) => res.json({ success: true }));
app.post('/api/administration/sync-voice-template-to-vendor', authMiddleware, (req, res) => res.json({ success: true }));

/* ───── WEBHOOKS ───── */

app.get('/api/get-webhook-events', authMiddleware, (req, res) => res.json({ data: [], total: 0 }));
app.get('/api/get-webhook-info/:id', authMiddleware, (req, res) => res.json({}));
app.post('/api/add-webhook-url', authMiddleware, (req, res) => res.json({ success: true }));

/* ───── FALLBACK ───── */

app.use((req, res) => {
  console.log(`[404] ${req.method} ${req.url}`);
  res.status(404).json({ error: `Endpoint not found: ${req.method} ${req.url}` });
});

app.listen(PORT, () => {
  console.log(`\n  🚀 NRT-SMS Mock Server running on http://localhost:${PORT}`);
  console.log(`  📝 Login: POST /api/login`);
  console.log(`  👤 Username: BhanusamajAarogyam`);
  console.log(`  🔑 Password: Newrise_64554`);
  console.log(`  ⚡ 100+ API endpoints available\n`);
});
