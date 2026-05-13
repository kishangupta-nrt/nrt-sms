import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { store, RootState } from './store';
import MainLayout from './layouts/MainLayout';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import SendSMS from './pages/sms/SendSMS';
import TwoWaySMS from './pages/sms/TwoWaySMS';
import SendWhatsApp from './pages/whatsapp/SendWhatsApp';
import WhatsAppTemplates from './pages/whatsapp/WhatsAppTemplates';
import WhatsAppConfig from './pages/whatsapp/WhatsAppConfig';
import DLTemplates from './pages/dlt/DLTemplates';
import SenderID from './pages/sender/SenderID';
import Phonebook from './pages/contacts/Phonebook';
import Groups from './pages/contacts/Groups';
import Campaigns from './pages/campaigns/Campaigns';
import Reports from './pages/reports/Reports';
import DetailedReport from './pages/reports/DetailedReport';
import Settings from './pages/settings/Settings';
import AccountSetting from './pages/settings/AccountSetting';
import Users from './pages/users/Users';
import Roles from './pages/roles/Roles';
import { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';

function PrivateRoute({ children }: { children: ReactNode }) {
  const token = useSelector((s: RootState) => s.auth.token);
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="sms/send" element={<SendSMS />} />
        <Route path="sms/two-way" element={<TwoWaySMS />} />
        <Route path="whatsapp/send" element={<SendWhatsApp />} />
        <Route path="whatsapp/templates" element={<WhatsAppTemplates />} />
        <Route path="whatsapp/config" element={<WhatsAppConfig />} />
        <Route path="dlt" element={<DLTemplates />} />
        <Route path="sender" element={<SenderID />} />
        <Route path="contacts/phonebook" element={<Phonebook />} />
        <Route path="contacts/groups" element={<Groups />} />
        <Route path="campaigns" element={<Campaigns />} />
        <Route path="reports/summary" element={<Reports />} />
        <Route path="reports/detailed" element={<DetailedReport />} />
        <Route path="users" element={<Users />} />
        <Route path="roles" element={<Roles />} />
        <Route path="settings" element={<Settings />} />
        <Route path="account-setting" element={<AccountSetting />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
        <ToastContainer />
      </BrowserRouter>
    </Provider>
  );
}
