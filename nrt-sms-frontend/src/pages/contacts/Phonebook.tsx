import { useState, useEffect, useRef } from 'react';
import { Card, CardBody, CardHeader, Input, Button } from 'reactstrap';
import PageHeader from '../../components/PageHeader';
import PaginationBar from '../../components/PaginationBar';
import CrudModal, { ConfirmModal } from '../../components/CrudModal';
import api from '../../api/axiosInstance';
import { showSuccess, showError } from '../../utils/toast';
import { downloadSampleContacts } from '../../utils/downloadSample';

export default function Phonebook() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 10;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: '', mobile: '', email: '', group: '' });
  const [saving, setSaving] = useState(false);

  const [confirmDel, setConfirmDel] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState('');

  const loadContacts = () => {
    api.get(`/contact-numbers?page=${page}&perPage=${perPage}`).then(r => {
      setContacts(r.data.data || []);
      setTotal(r.data.total || 0);
    }).catch(() => {});
  };

  useEffect(() => { loadContacts(); }, [page]);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', mobile: '', email: '', group: '' });
    setModal(true);
  };

  const openEdit = (c: any) => {
    setEditing(c);
    setForm({ name: c.name || '', mobile: c.mobile || '', email: c.email || '', group: c.group || '' });
    setModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/contact-number/${editing.id}`, form);
        showSuccess('Contact updated successfully');
      } else {
        await api.post('/contact-number', form);
        showSuccess('Contact added successfully');
      }
      setModal(false);
      loadContacts();
    } catch (err: any) {
      showError(err.response?.data?.error || 'Failed to save contact');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (id: string) => { setDeleteId(id); setConfirmDel(true); };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/contact-number/${deleteId}`);
      showSuccess('Contact deleted successfully');
      setConfirmDel(false);
      loadContacts();
    } catch {
      showError('Failed to delete contact');
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
      const res = await api.post('/contact-numbers-import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      showSuccess(`${res.data.count || 0} contacts imported successfully`);
      loadContacts();
    } catch {
      showError('Failed to import contacts');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const filtered = contacts.filter((c: any) =>
    !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.mobile?.includes(search)
  );

  return (
    <>
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".csv,.xlsx,.xls" onChange={handleFileImport} />
      <PageHeader title="Phonebook">
        <div className="d-flex gap-50">
          <Input type="text" placeholder="Search..." className="w-auto" value={search} onChange={e => setSearch(e.target.value)} />
          <Button color="primary" size="sm" onClick={openAdd}><i className="fas fa-plus me-50" />Add Contact</Button>
          <Button color="success" size="sm" onClick={() => fileInputRef.current?.click()}><i className="fas fa-upload me-50" />Import</Button>
          <Button color="info" size="sm" onClick={downloadSampleContacts}><i className="fas fa-download me-50" />Sample</Button>
        </div>
      </PageHeader>
      <Card>
        <CardBody>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr><th>Name</th><th>Mobile</th><th>Email</th><th>Group</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.length === 0 && <tr><td colSpan={5} className="text-center text-muted">No contacts found</td></tr>}
                {filtered.map((c: any) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{c.mobile}</td>
                    <td>{c.email}</td>
                    <td><span className="badge bg-light-primary text-primary">{c.group}</span></td>
                    <td>
                      <Button size="sm" color="flat-primary" className="me-25" onClick={() => openEdit(c)}><i className="fas fa-edit" /></Button>
                      <Button size="sm" color="flat-danger" onClick={() => confirmDelete(c.id)}><i className="fas fa-trash" /></Button>
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
        title={editing ? 'Edit Contact' : 'Add Contact'}
        fields={[
          { name: 'name', label: 'Name', required: true },
          { name: 'mobile', label: 'Mobile', required: true },
          { name: 'email', label: 'Email', type: 'email' },
          { name: 'group', label: 'Group' },
        ]}
        data={form}
        onChange={(f, v) => setForm(prev => ({ ...prev, [f]: v }))}
        onSave={handleSave}
        saving={saving}
      />

      <ConfirmModal
        isOpen={confirmDel}
        toggle={() => setConfirmDel(false)}
        title="Delete Contact"
        message="Are you sure you want to delete this contact?"
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  );
}
