import { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, Badge, Button } from 'reactstrap';
import PageHeader from '../../components/PageHeader';
import PaginationBar from '../../components/PaginationBar';
import CrudModal, { ConfirmModal } from '../../components/CrudModal';
import api from '../../api/axiosInstance';
import { showSuccess, showError } from '../../utils/toast';

export default function WhatsAppTemplates() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 9;

  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: '', category: '', language: 'en' });
  const [saving, setSaving] = useState(false);

  const [confirmDel, setConfirmDel] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState('');

  const load = () => {
    api.get(`/wa-templates?page=${page}&perPage=${perPage}`).then(r => {
      setTemplates(r.data.data || []);
      setTotal(r.data.total || 0);
    }).catch(() => showError('Failed to load templates'));
  };

  useEffect(() => { load(); }, [page]);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', category: 'Marketing', language: 'en' });
    setModal(true);
  };

  const openEdit = (t: any) => {
    setEditing(t);
    setForm({ name: t.name || '', category: t.category || 'Marketing', language: t.language || 'en' });
    setModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/wa-template/${editing.id}`, form);
        showSuccess('Template updated successfully');
      } else {
        await api.post('/wa-template', form);
        showSuccess('Template created successfully');
      }
      setModal(false);
      load();
    } catch (err: any) {
      showError(err.response?.data?.error || 'Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (id: string) => { setDeleteId(id); setConfirmDel(true); };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/wa-template/${deleteId}`);
      showSuccess('Template deleted successfully');
      setConfirmDel(false);
      load();
    } catch {
      showError('Failed to delete template');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageHeader title="WhatsApp Templates">
        <Button color="primary" size="sm" onClick={openAdd}><i className="fas fa-plus me-50" />Create Template</Button>
      </PageHeader>
      <Row>
        {templates.length === 0 && <Col><p className="text-center text-muted">No templates found</p></Col>}
        {templates.map((t: any) => (
          <Col md={4} key={t.id}>
            <Card className="mb-1">
              <CardBody>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h5 className="mb-0">{t.name}</h5>
                    <small className="text-muted">{t.category}</small>
                  </div>
                  <Badge color={t.status === 'Approved' ? 'success' : 'warning'}>{t.status}</Badge>
                </div>
                <hr />
                <p className="mb-0"><strong>Language:</strong> {t.language}</p>
                <p className="mb-0"><strong>Created:</strong> {t.created}</p>
                <div className="mt-1">
                  <Button size="sm" color="flat-primary" className="me-50" onClick={() => openEdit(t)}><i className="fas fa-edit" /></Button>
                  <Button size="sm" color="flat-danger" onClick={() => confirmDelete(t.id)}><i className="fas fa-trash" /></Button>
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
        title={editing ? 'Edit Template' : 'Create Template'}
        fields={[
          { name: 'name', label: 'Template Name', required: true },
          { name: 'category', label: 'Category', type: 'select', options: [
            { value: 'Marketing', label: 'Marketing' },
            { value: 'Utility', label: 'Utility' },
            { value: 'Authentication', label: 'Authentication' },
          ]},
          { name: 'language', label: 'Language' },
        ]}
        data={form}
        onChange={(f, v) => setForm(prev => ({ ...prev, [f]: v }))}
        onSave={handleSave}
        saving={saving}
      />

      <ConfirmModal
        isOpen={confirmDel}
        toggle={() => setConfirmDel(false)}
        title="Delete Template"
        message="Are you sure you want to delete this template?"
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  );
}
