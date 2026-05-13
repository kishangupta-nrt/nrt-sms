import { useState, useEffect, useRef } from 'react';
import { Card, CardBody, Badge, Button } from 'reactstrap';
import PageHeader from '../../components/PageHeader';
import PaginationBar from '../../components/PaginationBar';
import { ConfirmModal } from '../../components/CrudModal';
import api from '../../api/axiosInstance';
import { showSuccess, showError } from '../../utils/toast';

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 10;
  const pollingRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const [confirmDel, setConfirmDel] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState('');

  const load = () => {
    api.get(`/campaign-list?page=${page}&perPage=${perPage}`).then(r => {
      setCampaigns(r.data.data || []);
      setTotal(r.data.total || 0);
    }).catch(() => showError('Failed to load campaigns'));
  };

  useEffect(() => { load(); }, [page]);

  useEffect(() => {
    const hasRunning = campaigns.some((c: any) => c.status === 'Running');
    if (hasRunning) {
      pollingRef.current = setInterval(() => {
        api.get(`/campaign-list?page=${page}&perPage=${perPage}`).then(r => {
          setCampaigns(r.data.data || []);
        }).catch(() => {});
      }, 5000);
    }
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, [campaigns, page]);

  const confirmDelete = (id: string) => { setDeleteId(id); setConfirmDel(true); };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/campaign/${deleteId}`);
      showSuccess('Campaign deleted successfully');
      setConfirmDel(false);
      load();
    } catch {
      showError('Failed to delete campaign');
    } finally {
      setDeleting(false);
    }
  };

  const statusColor = (s: string) => {
    const map: Record<string, string> = { Completed: 'success', Running: 'info', Scheduled: 'primary', Draft: 'secondary' };
    return map[s] || 'secondary';
  };

  return (
    <>
      <PageHeader title="Campaigns">
        <Button color="primary" size="sm"><i className="fas fa-plus me-50" />New Campaign</Button>
      </PageHeader>
      <Card>
        <CardBody>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr><th>Name</th><th>Type</th><th>Status</th><th>Progress</th><th>Date</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {campaigns.length === 0 && <tr><td colSpan={6} className="text-center text-muted">No campaigns found</td></tr>}
                {campaigns.map((c: any) => (
                  <tr key={c.id}>
                    <td><strong>{c.name}</strong></td>
                    <td><Badge color={c.type === 'SMS' ? 'primary' : 'success'}>{c.type}</Badge></td>
                    <td><span className={`badge bg-light-${statusColor(c.status)} text-${statusColor(c.status)}`}>{c.status}</span></td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="progress w-50 me-50" style={{ height: 8 }}>
                          <div className={`progress-bar bg-${statusColor(c.status)}`} style={{ width: `${c.total > 0 ? (c.sent / c.total) * 100 : 0}%` }} />
                        </div>
                        <small>{c.sent}/{c.total}</small>
                      </div>
                    </td>
                    <td>{c.date}</td>
                    <td>
                      <Button size="sm" color="flat-primary" className="me-25"><i className="fas fa-eye" /></Button>
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

      <ConfirmModal
        isOpen={confirmDel}
        toggle={() => setConfirmDel(false)}
        title="Delete Campaign"
        message="Are you sure you want to delete this campaign?"
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  );
}
