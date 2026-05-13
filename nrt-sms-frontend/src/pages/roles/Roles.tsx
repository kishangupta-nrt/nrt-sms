import { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, Button } from 'reactstrap';
import PageHeader from '../../components/PageHeader';
import CrudModal from '../../components/CrudModal';
import api from '../../api/axiosInstance';
import { showSuccess, showError } from '../../utils/toast';

export default function Roles() {
  const [roles, setRoles] = useState<any[]>([]);

  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/roles').then(r => setRoles(r.data.data || [])).catch(() => showError('Failed to load roles'));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post('/role', form);
      showSuccess('Role created successfully');
      setModal(false);
      setForm({ name: '' });
      const r = await api.get('/roles');
      setRoles(r.data.data || []);
    } catch (err: any) {
      showError(err.response?.data?.error || 'Failed to create role');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader title="Roles & Permissions">
        <Button color="primary" size="sm" onClick={() => { setForm({ name: '' }); setModal(true); }}>
          <i className="fas fa-plus me-50" />Create Role
        </Button>
      </PageHeader>
      <Row>
        {roles.length === 0 && <Col><p className="text-center text-muted">No roles found</p></Col>}
        {roles.map((r: any) => (
          <Col md={3} key={r.id}>
            <Card>
              <CardBody className="text-center">
                <div className="avatar bg-light-primary rounded p-2 mb-1 d-inline-block">
                  <i className="fas fa-shield-alt text-primary" style={{ fontSize: '1.5rem' }} />
                </div>
                <h4>{r.name}</h4>
                <p className="mb-0"><strong>{r.users}</strong> Users</p>
                <hr />
                <div className="text-start">
                  <small className="text-muted">Permissions:</small>
                  <ul className="ps-2 mt-25">
                    {(r.permissions || []).map((p: string, i: number) => (
                      <li key={i}><small>{p}</small></li>
                    ))}
                  </ul>
                </div>
                <Button size="sm" color="outline-primary" className="w-100 mt-1">Manage Role</Button>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      <CrudModal
        isOpen={modal}
        toggle={() => setModal(false)}
        title="Create Role"
        fields={[{ name: 'name', label: 'Role Name', required: true }]}
        data={form}
        onChange={(f, v) => setForm(prev => ({ ...prev, [f]: v }))}
        onSave={handleSave}
        saving={saving}
      />
    </>
  );
}
