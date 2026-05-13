import { useState, useEffect } from 'react';
import { Card, CardBody, Input, Button } from 'reactstrap';
import PageHeader from '../../components/PageHeader';
import StatsCard from '../../components/StatsCard';
import PaginationBar from '../../components/PaginationBar';
import api from '../../api/axiosInstance';
import { downloadReportCSV } from '../../utils/downloadSample';

export default function Reports() {
  const [overview, setOverview] = useState({ sent: 125423, delivered: 118902, failed: 3421, pending: 3100 });
  const [records, setRecords] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const loadRecords = (p: number, from?: string, to?: string) => {
    const params: any = { page: p, perPage };
    if (from) params.fromDate = from;
    if (to) params.toDate = to;
    api.get('/delivery-report', { params }).then(r => {
      setRecords(r.data.data || []);
      setTotal(r.data.total || 0);
    }).catch(() => {});
  };

  useEffect(() => {
    api.get('/overview-report-by-user').then(r => setOverview(r.data)).catch(() => {});
    loadRecords(1);
  }, []);

  const handleSearch = () => {
    setPage(1);
    loadRecords(1, fromDate, toDate);
  };

  useEffect(() => { loadRecords(page, fromDate, toDate); }, [page]);

  return (
    <>
      <PageHeader title="Report Summary" />
      <div className="row match-height">
        <div className="col-xl-3 col-md-6 col-12">
          <StatsCard title="Total Sent" value={overview.sent.toLocaleString('en-IN')} icon="paper-plane" color="primary" />
        </div>
        <div className="col-xl-3 col-md-6 col-12">
          <StatsCard title="Delivered" value={overview.delivered.toLocaleString('en-IN')} icon="check-circle" color="success" />
        </div>
        <div className="col-xl-3 col-md-6 col-12">
          <StatsCard title="Failed" value={overview.failed.toLocaleString('en-IN')} icon="times-circle" color="danger" />
        </div>
        <div className="col-xl-3 col-md-6 col-12">
          <StatsCard title="Pending" value={overview.pending.toLocaleString('en-IN')} icon="clock" color="warning" />
        </div>
      </div>
      <Card className="mt-2">
        <div className="card-header">
          <h4 className="card-title">Delivery Report</h4>
          <div className="d-flex gap-50">
            <Input type="date" className="w-auto" value={fromDate} onChange={e => setFromDate(e.target.value)} />
            <Input type="date" className="w-auto" value={toDate} onChange={e => setToDate(e.target.value)} />
            <Button size="sm" color="primary" onClick={handleSearch}><i className="fas fa-search me-25" />Search</Button>
            <Button size="sm" color="secondary" onClick={() => downloadReportCSV(records, 'delivery-report.csv')} disabled={records.length === 0}>
              <i className="fas fa-download me-25" />Export
            </Button>
          </div>
        </div>
        <CardBody>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr><th>Mobile</th><th>Message</th><th>Sender ID</th><th>Status</th><th>Date</th><th>Credits</th></tr>
              </thead>
              <tbody>
                {records.length === 0 && <tr><td colSpan={6} className="text-center text-muted">No records found</td></tr>}
                {records.map((r: any, i: number) => (
                  <tr key={r.id || i}>
                    <td>{r.mobile}</td>
                    <td>{r.message?.substring(0, 30)}</td>
                    <td>{r.senderId}</td>
                    <td><span className={`badge bg-light-${r.status === 'Delivered' || r.status === 'Sent' ? 'success' : r.status === 'Failed' ? 'danger' : 'warning'} text-${r.status === 'Delivered' || r.status === 'Sent' ? 'success' : r.status === 'Failed' ? 'danger' : 'warning'}`}>{r.status}</span></td>
                    <td>{r.date ? new Date(r.date).toLocaleDateString() : ''}</td>
                    <td>{r.credits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PaginationBar page={page} perPage={perPage} total={total} onChange={setPage} />
        </CardBody>
      </Card>
    </>
  );
}
