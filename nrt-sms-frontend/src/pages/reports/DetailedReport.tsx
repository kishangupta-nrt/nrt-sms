import { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, CardHeader, Input, Button } from 'reactstrap';
import PageHeader from '../../components/PageHeader';
import PaginationBar from '../../components/PaginationBar';
import api from '../../api/axiosInstance';
import { showError } from '../../utils/toast';
import { downloadReportCSV } from '../../utils/downloadSample';

export default function DetailedReport() {
  const [records, setRecords] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [filters, setFilters] = useState({ fromDate: '', toDate: '', status: '' });

  const load = (p: number, f?: any) => {
    const params: any = { page: p, perPage };
    if (f?.fromDate) params.fromDate = f.fromDate;
    if (f?.toDate) params.toDate = f.toDate;
    if (f?.status) params.status = f.status;
    api.get('/detailed-report', { params }).then(r => {
      setRecords(r.data.data || []);
      setTotal(r.data.total || 0);
    }).catch(() => showError('Failed to load report'));
  };

  useEffect(() => { load(page, filters); }, [page]);

  const handleSearch = () => { setPage(1); load(1, filters); };

  return (
    <>
      <PageHeader title="Detailed Report" />
      <Card>
        <CardHeader><h4 className="card-title">Search Reports</h4></CardHeader>
        <CardBody>
          <Row className="align-items-end">
            <Col md={3}>
              <label className="form-label">From Date</label>
              <Input type="date" value={filters.fromDate} onChange={e => setFilters(prev => ({ ...prev, fromDate: e.target.value }))} />
            </Col>
            <Col md={3}>
              <label className="form-label">To Date</label>
              <Input type="date" value={filters.toDate} onChange={e => setFilters(prev => ({ ...prev, toDate: e.target.value }))} />
            </Col>
            <Col md={3}>
              <label className="form-label">Status</label>
              <Input type="select" value={filters.status} onChange={e => setFilters(prev => ({ ...prev, status: e.target.value }))}>
                <option value="">All</option>
                <option>Delivered</option>
                <option>Failed</option>
                <option>Pending</option>
                <option>Sent</option>
              </Input>
            </Col>
            <Col md={3}>
              <Button color="primary" block onClick={handleSearch}><i className="fas fa-search me-50" />Search</Button>
            </Col>
          </Row>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <div className="d-flex justify-content-end mb-1">
            <Button size="sm" color="secondary" onClick={() => downloadReportCSV(records, 'detailed-report.csv')} disabled={records.length === 0}>
              <i className="fas fa-download me-25" />Export
            </Button>
          </div>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr><th>#</th><th>Mobile</th><th>Message</th><th>Sender ID</th><th>Status</th><th>Date</th><th>Credits</th><th>DLT Template</th></tr>
              </thead>
              <tbody>
                {records.length === 0 && <tr><td colSpan={8} className="text-center text-muted">No records found</td></tr>}
                {records.map((r: any, i: number) => (
                  <tr key={r.id || i}>
                    <td>{(page - 1) * perPage + i + 1}</td>
                    <td>{r.mobile}</td>
                    <td>{r.message}</td>
                    <td>{r.senderId}</td>
                    <td><span className={`badge bg-light-${r.status === 'Delivered' || r.status === 'Sent' ? 'success' : r.status === 'Failed' ? 'danger' : 'warning'} text-${r.status === 'Delivered' || r.status === 'Sent' ? 'success' : r.status === 'Failed' ? 'danger' : 'warning'}`}>{r.status}</span></td>
                    <td>{r.date ? new Date(r.date).toLocaleDateString() : ''}</td>
                    <td>{r.credits}</td>
                    <td><small>{r.dltTemplate || r.dlt || ''}</small></td>
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
