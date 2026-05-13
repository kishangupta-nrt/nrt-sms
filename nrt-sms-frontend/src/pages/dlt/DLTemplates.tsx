import { useState, useEffect, useRef } from 'react';
import { Card, CardBody, CardHeader, Button } from 'reactstrap';
import PageHeader from '../../components/PageHeader';
import PaginationBar from '../../components/PaginationBar';
import CrudModal, { ConfirmModal } from '../../components/CrudModal';
import api from '../../api/axiosInstance';
import { showSuccess, showError } from '../../utils/toast';
import { downloadSampleDLT } from '../../utils/downloadSample';

export default function DLTemplates() {
  const [dlts, setDlts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 10;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ templateId: '', entityId: '', header: '', content: '' });
  const [saving, setSaving] = useState(false);

  const [confirmDel, setConfirmDel] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState('');

  const load = () => {
    api.get(`/dlt-templates?page=${page}&perPage=${perPage}`).then(r => {
      setDlts(r.data.data || []);
      setTotal(r.data.total || 0);
    }).catch(() => {});
  };

  useEffect(() => { load(); }, [page]);

  const openAdd = () => {
    setEditing(null);
    setForm({ templateId: '', entityId: '', header: '', content: '' });
    setModal(true);
  };

  const openEdit = (d: any) => {
    setEditing(d);
    setForm({ templateId: d.templateId || '', entityId: d.entityId || '', header: d.header || '', content: d.content || '' });
    setModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/dlt-template/${editing.id}`, form);
        showSuccess('DLT template updated successfully');
      } else {
        await api.post('/dlt-template', form);
        showSuccess('DLT template added successfully');
      }
      setModal(false);
      load();
    } catch (err: any) {
      showError(err.response?.data?.error || 'Failed to save DLT template');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (id: string) => { setDeleteId(id); setConfirmDel(true); };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/dlt-template/${deleteId}`);
      showSuccess('DLT template deleted successfully');
      setConfirmDel(false);
      load();
    } catch {
      showError('Failed to delete DLT template');
    } finally {
      setDeleting(false);
    }
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post('/dlt-templates-import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      showSuccess(`${res.data.count || 0} templates imported successfully`);
      load();
    } catch {
      showError('Failed to import templates');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <>
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".csv,.xlsx,.xls" onChange={handleFileImport} />
      <PageHeader title="DLT Templates">
        <div className="d-flex gap-50">
          <Button color="primary" size="sm" onClick={openAdd}><i className="fas fa-plus me-50" />New Template</Button>
          <Button color="success" size="sm" onClick={() => fileInputRef.current?.click()}><i className="fas fa-upload me-50" />Import</Button>
          <Button color="info" size="sm" onClick={downloadSampleDLT}><i className="fas fa-download me-50" />Sample</Button>
        </div>
      </PageHeader>
      <Card>
        <CardHeader><h4 className="card-title">Registered DLT Templates</h4></CardHeader>
        <CardBody>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Template ID</th>
                  <th>Entity ID</th>
                  <th>Header</th>
                  <th>Content</th>
                  <th>DLT Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {dlts.length === 0 && <tr><td colSpan={6} className="text-center text-muted">No DLT templates found</td></tr>}
                {dlts.map((d: any) => (
                  <tr key={d.id}>
                    <td><small>{d.id}</small></td>
                    <td><small>{d.entityId}</small></td>
                    <td>{d.header}</td>
                    <td><small>{d.content}</small></td>
                    <td><span className={`badge bg-light-${d.status === 'Approved' ? 'success' : 'warning'} text-${d.status === 'Approved' ? 'success' : 'warning'}`}>{d.status}</span></td>
                    <td>
                      <Button size="sm" color="flat-primary" className="me-25" onClick={() => openEdit(d)}><i className="fas fa-edit" /></Button>
                      <Button size="sm" color="flat-danger" onClick={() => confirmDelete(d.id)}><i className="fas fa-trash" /></Button>
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
        title={editing ? 'Edit DLT Template' : 'New DLT Template'}
        fields={[
          { name: 'templateId', label: 'Template ID', required: true },
          { name: 'entityId', label: 'Entity ID', required: true },
          { name: 'header', label: 'Header', required: true },
          { name: 'content', label: 'Content', type: 'textarea', required: true },
        ]}
        data={form}
        onChange={(f, v) => setForm(prev => ({ ...prev, [f]: v }))}
        onSave={handleSave}
        saving={saving}
      />

      <ConfirmModal
        isOpen={confirmDel}
        toggle={() => setConfirmDel(false)}
        title="Delete DLT Template"
        message="Are you sure you want to delete this DLT template?"
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  );
}
