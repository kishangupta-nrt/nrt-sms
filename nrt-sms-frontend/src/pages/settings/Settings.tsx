import { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, Button } from 'reactstrap';
import PageHeader from '../../components/PageHeader';
import api from '../../api/axiosInstance';
import { showSuccess, showError } from '../../utils/toast';

export default function Settings() {
  const [settings, setSettings] = useState<any>({ defaultSenderId: 'NRT-SMS', enableTwoWay: true, autoDeliveryReport: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/get-app-setting').then(r => setSettings({ ...r.data })).catch(() => showError('Failed to load settings'));
  }, []);

  const update = (field: string, value: any) => setSettings((prev: any) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post('/administration/app-setting-update', settings);
      showSuccess('Settings saved successfully');
    } catch (err: any) {
      showError(err.response?.data?.error || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader title="Settings" />
      <Row>
        <Col md={6}>
          <Card>
            <CardBody>
              <h5>Application Settings</h5>
              <hr />
              <div className="mb-2">
                <label className="form-label">Default Sender ID</label>
                <select className="form-select" value={settings.defaultSenderId} onChange={e => update('defaultSenderId', e.target.value)}>
                  <option>NRT-SMS</option>
                  <option>NRT-INFO</option>
                </select>
              </div>
              <div className="mb-2">
                <label className="form-label">Default Message Template</label>
                <input className="form-control" placeholder="Enter default template" value={settings.defaultTemplate || ''} onChange={e => update('defaultTemplate', e.target.value)} />
              </div>
              <div className="mb-2">
                <label className="form-check-label">
                  <input type="checkbox" className="form-check-input me-50" checked={settings.enableTwoWay} onChange={e => update('enableTwoWay', e.target.checked)} />
                  Enable Two-Way SMS
                </label>
              </div>
              <div className="mb-2">
                <label className="form-check-label">
                  <input type="checkbox" className="form-check-input me-50" checked={settings.autoDeliveryReport} onChange={e => update('autoDeliveryReport', e.target.checked)} />
                  Auto-delivery Report
                </label>
              </div>
              <Button color="primary" className="mt-1" onClick={handleSave} disabled={saving}>
                {saving ? <span className="spinner-border spinner-border-sm me-50" /> : null}
                Save Settings
              </Button>
            </CardBody>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <CardBody>
              <h5>SMS Gateway Configuration</h5>
              <hr />
              <div className="mb-2">
                <label className="form-label">API URL</label>
                <input className="form-control" value={settings.apiUrl || ''} readOnly />
              </div>
              <div className="mb-2">
                <label className="form-label">API Key</label>
                <input className="form-control" type="password" value="••••••••••••••••" readOnly />
              </div>
              <div className="mb-2">
                <label className="form-label">API Username</label>
                <input className="form-control" value={settings.username || ''} readOnly />
              </div>
              <Button color="outline-primary" className="mt-1">Regenerate API Key</Button>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
}
