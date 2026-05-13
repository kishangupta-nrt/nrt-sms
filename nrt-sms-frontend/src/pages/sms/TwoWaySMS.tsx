import { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, CardHeader } from 'reactstrap';
import PageHeader from '../../components/PageHeader';
import PaginationBar from '../../components/PaginationBar';
import api from '../../api/axiosInstance';
import { showError } from '../../utils/toast';

export default function TwoWaySMS() {
  const [messages, setMessages] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 10;

  useEffect(() => {
    api.get(`/two-ways-smses?page=${page}&perPage=${perPage}`).then(r => {
      setMessages(r.data.data || []);
      setTotal(r.data.total || 0);
    }).catch(() => showError('Failed to load two-way messages'));
  }, [page]);

  return (
    <>
      <PageHeader title="Two Way SMS" />
      <Row>
        <Col md={12}>
          <Card>
            <CardHeader><h4 className="card-title">Two Way Communication</h4></CardHeader>
            <CardBody>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr><th>Mobile</th><th>Last Message</th><th>Direction</th><th>Date</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {messages.length === 0 && <tr><td colSpan={5} className="text-center text-muted">No messages found</td></tr>}
                    {messages.map((r: any, i: number) => (
                      <tr key={r.id || i}>
                        <td>{r.mobile}</td>
                        <td>{r.message}</td>
                        <td><span className={`badge bg-light-${r.direction === 'Incoming' ? 'info' : 'primary'} text-${r.direction === 'Incoming' ? 'info' : 'primary'}`}>{r.direction}</span></td>
                        <td>{r.date}</td>
                        <td><span className="badge bg-light-success text-success">{r.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <PaginationBar page={page} perPage={perPage} total={total} onChange={setPage} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
}
