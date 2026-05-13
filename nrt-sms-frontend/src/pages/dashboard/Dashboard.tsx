import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../../components/StatsCard';
import api from '../../api/axiosInstance';
import { showError } from '../../utils/toast';

export default function Dashboard() {
  const navigate = useNavigate();
  const [overview, setOverview] = useState({ sent: 125423, delivered: 118902, failed: 3421, pending: 3100, total: 125423 });
  const [recentSms, setRecentSms] = useState<any[]>([]);

  useEffect(() => {
    api.get('/overview-report-by-user').then(r => setOverview(r.data)).catch(() => showError('Failed to load overview'));
    api.get('/datatables/data?type=sms&perPage=5').then(r => setRecentSms(r.data.data || [])).catch(() => showError('Failed to load recent SMS'));
  }, []);

  return (
    <>
      <div className="mb-2">
        <h2 className="content-header-title float-left mb-0 text-primary">Dashboard</h2>
      </div>
      <div className="row match-height">
        <div className="col-xl-3 col-md-6 col-12">
          <StatsCard title="SMS Sent" value={overview.sent.toLocaleString('en-IN')} icon="paper-plane" color="primary" />
        </div>
        <div className="col-xl-3 col-md-6 col-12">
          <StatsCard title="Delivered" value={overview.delivered.toLocaleString('en-IN')} icon="check-circle" color="success" />
        </div>
        <div className="col-xl-3 col-md-6 col-12">
          <StatsCard title="Failed" value={overview.failed.toLocaleString('en-IN')} icon="times-circle" color="danger" />
        </div>
        <div className="col-xl-3 col-md-6 col-12">
          <StatsCard title="Balance Credits" value="45,230" icon="coins" color="info" />
        </div>
      </div>
      <div className="row match-height mt-2">
        <div className="col-lg-8 col-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Recent SMS Activity</h4>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Mobile</th>
                      <th>Message</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Credits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSms.length === 0 && <tr><td colSpan={5} className="text-center text-muted">No recent activity</td></tr>}
                    {recentSms.map((row: any, i: number) => (
                      <tr key={row.id || i}>
                        <td>{row.mobile}</td>
                        <td>{row.message?.substring(0, 30)}</td>
                        <td><span className={`badge bg-light-${row.status === 'Delivered' || row.status === 'Sent' ? 'success' : row.status === 'Failed' ? 'danger' : 'warning'} text-${row.status === 'Delivered' || row.status === 'Sent' ? 'success' : row.status === 'Failed' ? 'danger' : 'warning'}`}>{row.status}</span></td>
                        <td>{row.date ? new Date(row.date).toLocaleDateString() : ''}</td>
                        <td>{row.credits}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Quick Actions</h4>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button className="btn btn-outline-primary" onClick={() => navigate('/sms/send')}>
                  <i className="fas fa-paper-plane me-50" /> Send SMS
                </button>
                <button className="btn btn-outline-success" onClick={() => navigate('/whatsapp/send')}>
                  <i className="fab fa-whatsapp me-50" /> Send WhatsApp
                </button>
                <button className="btn btn-outline-info" onClick={() => navigate('/contacts/phonebook')}>
                  <i className="fas fa-address-book me-50" /> Manage Contacts
                </button>
                <button className="btn btn-outline-warning" onClick={() => navigate('/reports/summary')}>
                  <i className="fas fa-chart-bar me-50" /> View Reports
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
