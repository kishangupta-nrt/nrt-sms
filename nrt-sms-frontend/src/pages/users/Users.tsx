import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Input, Button, Badge } from 'reactstrap';
import PageHeader from '../../components/PageHeader';
import PaginationBar from '../../components/PaginationBar';
import CrudModal, { ConfirmModal } from '../../components/CrudModal';
import api from '../../api/axiosInstance';
import { showSuccess, showError } from '../../utils/toast';

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 10;

  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ username: '', fullName: '', email: '', role: 'user', password: '' });
  const [saving, setSaving] = useState(false);

  const [confirmDel, setConfirmDel] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState('');

  const load = () => {
    api.get(`/users?page=${page}&perPage=${perPage}`).then(r => {
      setUsers(r.data.data || []);
      setTotal(r.data.total || 0);
    }).catch(() => {});
  };

  useEffect(() => { load(); }, [page]);

  const openAdd = () => {
    setEditing(null);
    setForm({ username: '', fullName: '', email: '', role: 'user', password: '' });
    setModal(true);
  };

  const openEdit = (u: any) => {
    setEditing(u);
    setForm({ username: u.username || '', fullName: u.fullName || '', email: u.email || '', role: u.role || 'user', password: '' });
    setModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/user/${editing.id}`, form);
        showSuccess('User updated successfully');
      } else {
        await api.post('/user', form);
        showSuccess('User created successfully');
      }
      setModal(false);
      load();
    } catch (err: any) {
      showError(err.response?.data?.error || 'Failed to save user');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (id: string) => { setDeleteId(id); setConfirmDel(true); };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/user/${deleteId}`);
      showSuccess('User deleted successfully');
      setConfirmDel(false);
      load();
    } catch {
      showError('Failed to delete user');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = users.filter((u: any) =>
    !search || u.username?.toLowerCase().includes(search.toLowerCase()) || u.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <PageHeader title="User Management">
        <Button color="primary" size="sm" onClick={openAdd}><i className="fas fa-plus me-50" />Add User</Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <h4 className="card-title">All Users</h4>
          <Input type="text" placeholder="Search users..." className="w-auto" value={search} onChange={e => setSearch(e.target.value)} />
        </CardHeader>
        <CardBody>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr><th>Username</th><th>Full Name</th><th>Email</th><th>Role</th><th>Status</th><th>Credits</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.length === 0 && <tr><td colSpan={7} className="text-center text-muted">No users found</td></tr>}
                {filtered.map((u: any) => (
                  <tr key={u.id}>
                    <td><strong>{u.username}</strong></td>
                    <td>{u.fullName}</td>
                    <td>{u.email}</td>
                    <td><Badge color="primary">{u.role}</Badge></td>
                    <td><span className={`badge bg-light-${u.status === 'Active' ? 'success' : 'danger'} text-${u.status === 'Active' ? 'success' : 'danger'}`}>{u.status}</span></td>
                    <td>{u.credits?.toLocaleString() || 0}</td>
                    <td>
                      <Button size="sm" color="flat-primary" className="me-25" onClick={() => openEdit(u)}><i className="fas fa-edit" /></Button>
                      <Button size="sm" color="flat-danger" onClick={() => confirmDelete(u.id)}><i className="fas fa-trash" /></Button>
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
        title={editing ? 'Edit User' : 'Add User'}
        fields={[
          { name: 'username', label: 'Username', required: true },
          { name: 'fullName', label: 'Full Name', required: true },
          { name: 'email', label: 'Email', type: 'email' },
          { name: 'role', label: 'Role', type: 'select', options: [{ value: 'user', label: 'User' }, { value: 'admin', label: 'Admin' }] },
          ...(editing ? [] : [{ name: 'password', label: 'Password', type: 'password' as const, required: true }]),
        ]}
        data={form}
        onChange={(f, v) => setForm(prev => ({ ...prev, [f]: v }))}
        onSave={handleSave}
        saving={saving}
      />

      <ConfirmModal
        isOpen={confirmDel}
        toggle={() => setConfirmDel(false)}
        title="Delete User"
        message="Are you sure you want to delete this user?"
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  );
}
