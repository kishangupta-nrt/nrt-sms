import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s: RootState) => s.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="header-navbar navbar navbar-expand-lg navbar-fixed align-items-center navbar-shadow navbar-light">
      <div className="navbar-container d-flex content">
        <div className="bookmark-wrapper d-flex align-items-center">
          <ul className="nav navbar-nav d-xl-none">
            <li className="nav-item">
              <a className="nav-link menu-toggle" onClick={() => document.body.classList.toggle('menu-open')}>
                <i className="fas fa-bars" />
              </a>
            </li>
          </ul>
          <div className="ms-1">
            <h5 className="mb-0">Welcome, {user?.fullName || user?.username || 'User'}</h5>
          </div>
        </div>
        <ul className="nav navbar-nav align-items-center ms-auto">
          <li className="nav-item dropdown dropdown-user">
            <a className="nav-link dropdown-toggle" onClick={() => document.getElementById('user-dropdown')?.classList.toggle('show')}>
              <div className="avatar bg-light-primary rounded-circle p-1 me-50">
                <i className="fas fa-user text-primary" />
              </div>
              <span className="fw-bold">{user?.username}</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
