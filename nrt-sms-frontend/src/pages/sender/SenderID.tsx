import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button } from 'reactstrap';
import PageHeader from '../../components/PageHeader';
import PaginationBar from '../../components/PaginationBar';
import CrudModal, { ConfirmModal } from '../../components/CrudModal';
import api from '../../api/axiosInstance';
import { showSuccess, showError } from '../../utils/toast';
import { downloadSampleSenderID } from '../../utils/downloadSample';

export default function SenderID() {
  const [senders, setSenders] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 10;

  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ senderId: '' });
  const [saving, setSaving] = useState(false);

  const [confirmDel, setConfirmDel] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState('');

  const load = () => {
    api.get(`/manage-sender-ids?page=${page}&perPage=${perPage}`).then(r => {
      setSenders(r.data.data || []);
      setTotal(r.data.total || 0);
    }).catch(() => showError('Failed to load sender IDs'));
  };

  useEffect(() => { load(); }, [page]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post('/manage-sender-id', form);
      showSuccess('Sender ID added successfully');
      setModal(false);
      setForm({ senderId: '' });
      load();
    } catch (err: any) {
      showError(err.response?.data?.error || 'Failed to add sender ID');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (id: string) => { setDeleteId(id); setConfirmDel(true); };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/manage-sender-id/${deleteId}`);
      showSuccess('Sender ID deleted successfully');
      setConfirmDel(false);
      load();
    } catch {
      showError('Failed to delete sender ID');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageHeader title="Sender ID">
        <div className="d-flex gap-50">
          <Button color="primary" size="sm" onClick={() => { setForm({ senderId: '' }); setModal(true); }}>
            <i className="fas fa-plus me-50" />Add Sender ID
          </Button>
          <Button color="info" size="sm" onClick={downloadSampleSenderID}>
            <i className="fas fa-download me-50" />Sample
          </Button>
        </div>
      </PageHeader>
      <Card>
        <CardHeader><h4 className="card-title">Registered Sender IDs</h4></CardHeader>
        <CardBody>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr><th>Sender ID</th><th>Status</th><th>Created</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {senders.length === 0 && <tr><td colSpan={4} className="text-center text-muted">No sender IDs found</td></tr>}
                {senders.map((s: any) => (
                  <tr key={s.id}>
                    <td><strong>{s.senderId}</strong></td>
                    <td><span className={`badge bg-light-${s.status === 'Approved' ? 'success' : 'warning'} text-${s.status === 'Approved' ? 'success' : 'warning'}`}>{s.status}</span></td>
                    <td>{s.created}</td>
                    <td>
                      <Button size="sm" color="flat-danger" onClick={() => confirmDelete(s.id)}><i className="fas fa-trash" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PaginationBar page={page} perPage={perPage} total={total} onChange={setPage} />
        </CardBody>
      </Card>

      <CrudModal
        isOpen={modal}
        toggle={() => setModal(false)}
        title="Add Sender ID"
        fields={[{ name: 'senderId', label: 'Sender ID', required: true }]}
        data={form}
        onChange={(f, v) => setForm(prev => ({ ...prev, [f]: v }))}
        onSave={handleSave}
        saving={saving}
      />

      <ConfirmModal
        isOpen={confirmDel}
        toggle={() => setConfirmDel(false)}
        title="Delete Sender ID"
        message="Are you sure you want to delete this sender ID?"
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  );
}
