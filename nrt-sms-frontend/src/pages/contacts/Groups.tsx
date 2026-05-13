import { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, Button } from 'reactstrap';
import PageHeader from '../../components/PageHeader';
import CrudModal from '../../components/CrudModal';
import api from '../../api/axiosInstance';
import { showSuccess, showError } from '../../utils/toast';

export default function Groups() {
  const [groups, setGroups] = useState<any[]>([]);

  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: '' });
  const [saving, setSaving] = useState(false);

  const load = () => {
    api.get('/contact-groups').then(r => setGroups(r.data.data || [])).catch(() => showError('Failed to load groups'));
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post('/contact-group', form);
      showSuccess('Group created successfully');
      setModal(false);
      setForm({ name: '' });
      load();
    } catch (err: any) {
      showError(err.response?.data?.error || 'Failed to create group');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader title="Contact Groups">
        <Button color="primary" size="sm" onClick={() => { setForm({ name: '' }); setModal(true); }}>
          <i className="fas fa-plus me-50" />Create Group
        </Button>
      </PageHeader>
      <Row>
        {groups.length === 0 && <Col><p className="text-center text-muted">No groups found</p></Col>}
        {groups.map((g: any) => (
          <Col md={3} key={g.id}>
            <Card>
              <CardBody className="text-center">
                <div className="avatar bg-light-primary rounded p-2 mb-1 d-inline-block">
                  <i className="fas fa-users text-primary" style={{ fontSize: '1.5rem' }} />
                </div>
                <h4 className="mb-0">{g.name}</h4>
                <h2 className="text-primary mb-0">{g.count}</h2>
                <small className="text-muted">Contacts</small>
                <hr />
                <Button size="sm" color="outline-primary" className="w-100">View Contacts</Button>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      <CrudModal
        isOpen={modal}
        toggle={() => setModal(false)}
        title="Create Group"
        fields={[{ name: 'name', label: 'Group Name', required: true }]}
        data={form}
        onChange={(f, v) => setForm(prev => ({ ...prev, [f]: v }))}
        onSave={handleSave}
        saving={saving}
      />
    </>
  );
}
