import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/slices/authSlice';
import { SIDEBAR_ITEMS } from '../utils/constants';
import { SidebarItem } from '../types';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((s: RootState) => s.auth.user);

  const toggleMenu = (id: string) => {
    setExpandedMenus((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const isActive = (item: SidebarItem): boolean => {
    if (item.path && location.pathname === item.path) return true;
    if (item.children) return item.children.some((c) => location.pathname === c.path);
    return false;
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className={`main-menu menu-fixed menu-accordion ${collapsed ? 'menu-collapsed' : ''}`}>
      <div className="navbar-header">
        <Link to="/" className="navbar-brand">
          <span className="brand-logo">
            <i className="fas fa-sms text-primary" style={{ fontSize: '2rem' }} />
          </span>
          <h2 className="brand-text">NRT-SMS</h2>
        </Link>
        <div className="toggle-icon" onClick={() => setCollapsed(!collapsed)}>
          <i className={`fas fa-${collapsed ? 'chevron-right' : 'chevron-left'}`} />
        </div>
      </div>
      <div className="shadow-bottom" />
      <div className="main-menu-content">
        <ul className="navigation navigation-main" id="main-menu-navigation">
          {SIDEBAR_ITEMS.map((item) => (
            <li
              key={item.id}
              className={`nav-item ${isActive(item) ? 'active' : ''} ${item.children ? 'has-sub' : ''} ${expandedMenus.includes(item.id) ? 'open' : ''}`}
            >
              {item.children ? (
                <>
                  <a className="nav-link" onClick={() => toggleMenu(item.id)}>
                    <i className={`fas fa-${item.icon}`} />
                    <span className="menu-title">{item.label}</span>
                    <i className={`fas fa-chevron-${expandedMenus.includes(item.id) ? 'down' : 'right'} menu-arrow`} />
                  </a>
                  <ul className="menu-content">
                    {item.children.map((child) => (
                      <li key={child.id} className={location.pathname === child.path ? 'active' : ''}>
                        <Link to={child.path!}>
                          <i className={`fas fa-${child.icon}`} />
                          <span className="menu-title">{child.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <Link to={item.path!} className="nav-link">
                  <i className={`fas fa-${item.icon}`} />
                  <span className="menu-title">{item.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="profile-section">
        <div className="d-flex align-items-center p-2">
          <div className="avatar me-1">
            <div className="avatar-content bg-light-primary rounded-circle p-1">
              <i className="fas fa-user text-primary" />
            </div>
          </div>
          <div className="flex-grow-1">
            <p className="mb-0 fw-bold">{user?.username || 'User'}</p>
            <small className="text-muted">{user?.role || 'user'}</small>
          </div>
          <i className="fas fa-sign-out-alt text-muted cursor-pointer" onClick={handleLogout} />
        </div>
      </div>
    </div>
  );
}
