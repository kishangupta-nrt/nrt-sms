import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Spinner } from 'reactstrap';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import { RootState } from '../../store';
import api from '../../api/axiosInstance';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s: RootState) => s.auth);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      dispatch(loginFailure('Please enter username and password'));
      return;
    }
    dispatch(loginStart());
    try {
      const res = await api.post('/login', { username, password });
      const data = res.data;
      if (data.user && data.token) {
        dispatch(loginSuccess({ user: data.user, token: data.token }));
        const ability = data.user.ability || [{ action: 'read', subject: 'Auth' }];
        localStorage.setItem('nrtData', JSON.stringify({ ability }));
        navigate('/');
      } else {
        dispatch(loginFailure('Invalid credentials'));
      }
    } catch (err: any) {
      dispatch(loginFailure(err.response?.data?.error || err.message || 'Login failed'));
    }
  };

  return (
    <div className="auth-wrapper auth-v1">
      <div className="auth-inner">
        <div className="card mb-0">
          <div className="card-body">
            <Link to="/" className="brand-logo text-center d-block mb-2">
              <i className="fas fa-sms text-primary" style={{ fontSize: '2.5rem' }} />
              <h2 className="brand-text text-primary ms-50">NRT-SMS</h2>
            </Link>
            <div className="text-center mb-1">
              <h4 className="card-title mb-25">Welcome!</h4>
              <p className="card-text mb-0">Please sign in to your account</p>
            </div>
            {error && <Alert color="danger" className="py-1">{error}</Alert>}
            <form onSubmit={handleSubmit}>
              <div className="mb-1">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-1">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                {loading ? <Spinner size="sm" className="me-50" /> : null}
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
