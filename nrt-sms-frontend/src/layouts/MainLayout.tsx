import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function MainLayout() {
  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content-page">
        <Header />
        <div className="content-wrapper">
          <div className="content-body">
            <div className="container-fluid p-3">
              <Outlet />
            </div>
          </div>
        </div>
        <footer className="footer footer-light">
          <p className="mb-0 clearfix">
            <span className="float-md-start d-block d-md-inline-block mt-25">
              &copy; {new Date().getFullYear()}{' '}
              <a href="/" target="_blank">NRT-SMS</a>, All rights Reserved.
            </span>
          </p>
        </footer>
      </div>
    </div>
  );
}
