import { useState } from 'react';
import { Row, Col, Card, CardBody, CardHeader, FormGroup, Label, Input, Button, Spinner } from 'reactstrap';
import PageHeader from '../../components/PageHeader';
import api from '../../api/axiosInstance';
import { showSuccess, showError } from '../../utils/toast';

export default function SendWhatsApp() {
  const [form, setForm] = useState({ mobile: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await api.post('/wa-send-message', form);
      if (res.data.success) {
        showSuccess('WhatsApp message sent successfully!');
        setForm({ mobile: '', message: '' });
      }
    } catch (err: any) {
      showError(err.response?.data?.error || err.message || 'Failed to send WhatsApp message');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <PageHeader title="Send WhatsApp" />
      <Row>
        <Col md={6}>
          <Card>
            <CardHeader><h4 className="card-title">Compose WhatsApp Message</h4></CardHeader>
            <CardBody>
              <form onSubmit={handleSend}>
                <FormGroup>
                  <Label>Mobile Number (with country code)</Label>
                  <Input placeholder="e.g. 919876543210" value={form.mobile} onChange={e => setForm(prev => ({ ...prev, mobile: e.target.value }))} required />
                </FormGroup>
                <FormGroup>
                  <Label>Message</Label>
                  <Input type="textarea" rows={4} placeholder="Type your WhatsApp message..." value={form.message} onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))} required />
                </FormGroup>
                <Button color="success" type="submit" disabled={sending}>
                  {sending ? <Spinner size="sm" className="me-50" /> : <i className="fab fa-whatsapp me-50" />}
                  Send via WhatsApp
                </Button>
              </form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
}
