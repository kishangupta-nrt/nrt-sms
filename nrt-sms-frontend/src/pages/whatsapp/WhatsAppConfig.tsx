import { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, Button } from 'reactstrap';
import PageHeader from '../../components/PageHeader';
import PaginationBar from '../../components/PaginationBar';
import CrudModal, { ConfirmModal } from '../../components/CrudModal';
import api from '../../api/axiosInstance';
import { showSuccess, showError } from '../../utils/toast';

export default function WhatsAppConfig() {
  const [configs, setConfigs] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 6;

  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', provider: 'Twilio' });
  const [saving, setSaving] = useState(false);

  const [confirmDel, setConfirmDel] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState('');

  const load = () => {
    api.get(`/wa-account-configurations?page=${page}&perPage=${perPage}`).then(r => {
      setConfigs(r.data.data || []);
      setTotal(r.data.total || 0);
    }).catch(() => showError('Failed to load configurations'));
  };

  useEffect(() => { load(); }, [page]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post('/wa-account-configuration', form);
      showSuccess('Configuration added successfully');
      setModal(false);
      setForm({ name: '', phone: '', provider: 'Twilio' });
      load();
    } catch (err: any) {
      showError(err.response?.data?.error || 'Failed to add configuration');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (id: string) => { setDeleteId(id); setConfirmDel(true); };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/wa-account-configuration/${deleteId}`);
      showSuccess('Configuration removed successfully');
      setConfirmDel(false);
      load();
    } catch {
      showError('Failed to remove configuration');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageHeader title="WhatsApp Configuration">
        <Button color="primary" size="sm" onClick={() => { setForm({ name: '', phone: '', provider: 'Twilio' }); setModal(true); }}>
          <i className="fas fa-plus me-50" />Add Configuration
        </Button>
      </PageHeader>
      <Row>
        {configs.length === 0 && <Col><p className="text-center text-muted">No configurations found</p></Col>}
        {configs.map((c: any) => (
          <Col md={6} key={c.id}>
            <Card>
              <CardBody>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-0">{c.name}</h5>
                    <small className="text-muted">{c.phone}</small>
                  </div>
                  <span className={`badge bg-light-${c.status === 'Connected' ? 'success' : 'danger'} text-${c.status === 'Connected' ? 'success' : 'danger'}`}>
                    {c.status}
                  </span>
                </div>
                <hr />
                <p className="mb-0">Provider: {c.provider}</p>
                <div className="mt-1">
                  <Button size="sm" color="flat-danger" onClick={() => confirmDelete(c.id)}><i className="fas fa-trash" /> Remove</Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
      <PaginationBar page={page} perPage={perPage} total={total} onChange={setPage} />

      <CrudModal
        isOpen={modal}
        toggle={() => setModal(false)}
        title="Add Configuration"
        fields={[
          { name: 'name', label: 'Name', required: true },
          { name: 'phone', label: 'Phone Number', required: true },
          { name: 'provider', label: 'Provider', type: 'select', options: [
            { value: 'Twilio', label: 'Twilio' },
            { value: 'Meta', label: 'Meta' },
            { value: 'Gupshup', label: 'Gupshup' },
          ]},
        ]}
        data={form}
        onChange={(f, v) => setForm(prev => ({ ...prev, [f]: v }))}
        onSave={handleSave}
        saving={saving}
      />

      <ConfirmModal
        isOpen={confirmDel}
        toggle={() => setConfirmDel(false)}
        title="Remove Configuration"
        message="Are you sure you want to remove this configuration?"
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  );
}
