import { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, CardHeader, FormGroup, Label, Input, Button, Spinner } from 'reactstrap';
import PageHeader from '../../components/PageHeader';
import api from '../../api/axiosInstance';
import { showSuccess, showError } from '../../utils/toast';

export default function SendSMS() {
  const [form, setForm] = useState({ mobile: '', message: '', senderId: 'NRT-SMS' });
  const [sending, setSending] = useState(false);
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    api.get('/campaign-list?perPage=3').then(r => setRecent(r.data.data || [])).catch(() => {});
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await api.post('/send-sms', form);
      if (res.data.success) {
        showSuccess(`SMS sent successfully! (${res.data.count} messages)`);
        setForm(prev => ({ ...prev, mobile: '', message: '' }));
        const r = await api.get('/campaign-list?perPage=3');
        setRecent(r.data.data || []);
      }
    } catch (err: any) {
      showError(err.response?.data?.error || err.message || 'Failed to send SMS');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <PageHeader title="Send SMS">
        <span className="badge bg-light-info text-info">Balance: 45,230 Credits</span>
      </PageHeader>
      <Row>
        <Col md={6}>
          <Card>
            <CardHeader><h4 className="card-title">Compose SMS</h4></CardHeader>
            <CardBody>
              <form onSubmit={handleSend}>
                <FormGroup>
                  <Label>Sender ID</Label>
                  <Input type="select" value={form.senderId} onChange={e => setForm(prev => ({ ...prev, senderId: e.target.value }))}>
                    <option>NRT-SMS</option>
                    <option>NRT-INFO</option>
                    <option>NRT-ALERT</option>
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label>Mobile Numbers</Label>
                  <Input type="textarea" rows={2} placeholder="Enter mobile numbers, one per line" value={form.mobile} onChange={e => setForm(prev => ({ ...prev, mobile: e.target.value }))} required />
                  <small className="text-muted">Enter up to 100 numbers. Use 10-digit Indian numbers.</small>
                </FormGroup>
                <FormGroup>
                  <Label>Message</Label>
                  <Input type="textarea" rows={4} placeholder="Type your message here..." value={form.message} onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))} required />
                  <small className="text-muted">{form.message.length} / 160 characters</small>
                </FormGroup>
                <Button color="primary" type="submit" disabled={sending}>
                  {sending ? <Spinner size="sm" className="me-50" /> : <i className="fas fa-paper-plane me-50" />}
                  Send SMS
                </Button>
              </form>
            </CardBody>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <CardHeader><h4 className="card-title">Recent Messages</h4></CardHeader>
            <CardBody>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr><th>Mobile</th><th>Message</th><th>Status</th><th>Date</th></tr>
                  </thead>
                  <tbody>
                    {recent.length === 0 && <tr><td colSpan={4} className="text-center text-muted">No messages yet</td></tr>}
                    {recent.map((r: any, i: number) => (
                      <tr key={r.id || i}>
                        <td>{r.mobile}</td>
                        <td>{r.message?.substring(0, 30)}</td>
                        <td><span className={`badge bg-light-${r.status === 'Delivered' || r.status === 'Sent' ? 'success' : 'warning'} text-${r.status === 'Delivered' || r.status === 'Sent' ? 'success' : 'warning'}`}>{r.status}</span></td>
                        <td>{r.date ? new Date(r.date).toLocaleDateString() : ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
}
