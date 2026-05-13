import { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, CardHeader, Button } from 'reactstrap';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import PageHeader from '../../components/PageHeader';
import api from '../../api/axiosInstance';
import { showSuccess, showError } from '../../utils/toast';

export default function AccountSetting() {
  const user = useSelector((s: RootState) => s.auth.user);
  const [profile, setProfile] = useState({ fullName: '', email: '', mobile: '' });
  const [password, setPassword] = useState({ current: '', newPass: '', confirm: '' });
  const [profileSaving, setProfileSaving] = useState(false);
  const [passSaving, setPassSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({ fullName: user.fullName || '', email: user.email || '', mobile: '' });
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    setProfileSaving(true);
    try {
      await api.post('/update-profile', profile);
      showSuccess('Profile updated successfully');
    } catch (err: any) {
      showError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (password.newPass !== password.confirm) {
      showError('Passwords do not match');
      return;
    }
    setPassSaving(true);
    try {
      await api.post('/update-self-password', { currentPassword: password.current, newPassword: password.newPass });
      showSuccess('Password changed successfully');
      setPassword({ current: '', newPass: '', confirm: '' });
    } catch (err: any) {
      showError(err.response?.data?.error || 'Failed to change password');
    } finally {
      setPassSaving(false);
    }
  };

  return (
    <>
      <PageHeader title="Account Settings" />
      <Row>
        <Col md={6}>
          <Card>
            <CardHeader><h4 className="card-title">Profile Information</h4></CardHeader>
            <CardBody>
              <div className="mb-2">
                <label className="form-label">Full Name</label>
                <input className="form-control" value={profile.fullName} onChange={e => setProfile(prev => ({ ...prev, fullName: e.target.value }))} />
              </div>
              <div className="mb-2">
                <label className="form-label">Username</label>
                <input className="form-control" value={user?.username || ''} readOnly />
              </div>
              <div className="mb-2">
                <label className="form-label">Email</label>
                <input className="form-control" type="email" value={profile.email} onChange={e => setProfile(prev => ({ ...prev, email: e.target.value }))} />
              </div>
              <div className="mb-2">
                <label className="form-label">Mobile</label>
                <input className="form-control" value={profile.mobile} onChange={e => setProfile(prev => ({ ...prev, mobile: e.target.value }))} />
              </div>
              <Button color="primary" onClick={handleUpdateProfile} disabled={profileSaving}>
                {profileSaving ? <span className="spinner-border spinner-border-sm me-50" /> : null}
                Update Profile
              </Button>
            </CardBody>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <CardHeader><h4 className="card-title">Change Password</h4></CardHeader>
            <CardBody>
              <div className="mb-2">
                <label className="form-label">Current Password</label>
                <input className="form-control" type="password" value={password.current} onChange={e => setPassword(prev => ({ ...prev, current: e.target.value }))} />
              </div>
              <div className="mb-2">
                <label className="form-label">New Password</label>
                <input className="form-control" type="password" value={password.newPass} onChange={e => setPassword(prev => ({ ...prev, newPass: e.target.value }))} />
              </div>
              <div className="mb-2">
                <label className="form-label">Confirm New Password</label>
                <input className="form-control" type="password" value={password.confirm} onChange={e => setPassword(prev => ({ ...prev, confirm: e.target.value }))} />
              </div>
              <Button color="primary" onClick={handleChangePassword} disabled={passSaving}>
                {passSaving ? <span className="spinner-border spinner-border-sm me-50" /> : null}
                Change Password
              </Button>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
}
