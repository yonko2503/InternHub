import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  User, 
  Lock, 
  Mail, 
  Phone, 
  Building2, 
  GraduationCap, 
  Sparkles, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import Logo from './Logo';

export default function AuthModal({ initialMode = 'login', onClose }) {
  const { login, register, quickLogin } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [registerRole, setRegisterRole] = useState('ROLE_STUDENT'); // or 'ROLE_COMPANY'

  // Login form
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form
  const [regData, setRegData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    phone: '',
    university: 'Đại học Công nghệ - ĐHQGHN (UET)',
    major: 'Công nghệ Thông tin',
    studentCode: '',
    companyName: '',
    address: 'Hà Nội',
    website: '',
    industry: 'Công nghệ thông tin',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(loginUsername, loginPassword);
      onClose();
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register({ ...regData, role: registerRole });
      onClose();
    } catch (err) {
      setError(err.message || 'Đăng ký tài khoản thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-auth animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <Logo size="small" />
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="alert alert-danger">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {/* Mode Switch Tabs */}
          <div className="auth-tab-switch">
            <button
              className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
              onClick={() => { setMode('login'); setError(null); }}
            >
              Đăng nhập
            </button>
            <button
              className={`auth-tab-btn ${mode === 'register' ? 'active' : ''}`}
              onClick={() => { setMode('register'); setError(null); }}
            >
              Đăng ký tài khoản
            </button>
          </div>

          {/* LOGIN FORM */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label">Tên đăng nhập hoặc Email:</label>
                <div className="input-with-icon">
                  <User size={16} className="input-icon" />
                  <input
                    type="text"
                    className="form-input"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="vd: student_uet hoặc email"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Mật khẩu:</label>
                <div className="input-with-icon">
                  <Lock size={16} className="input-icon" />
                  <input
                    type="password"
                    className="form-input"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Nhập mật khẩu của bạn"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? 'Đang xác thực...' : 'Đăng nhập vào hệ thống'}
              </button>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} className="auth-form">
              <div className="role-selector-row">
                <label className="form-label">Bạn là:</label>
                <div className="role-choices">
                  <button
                    type="button"
                    className={`role-choice-btn ${registerRole === 'ROLE_STUDENT' ? 'selected' : ''}`}
                    onClick={() => setRegisterRole('ROLE_STUDENT')}
                  >
                    <GraduationCap size={16} /> Sinh viên UET
                  </button>
                  <button
                    type="button"
                    className={`role-choice-btn ${registerRole === 'ROLE_COMPANY' ? 'selected' : ''}`}
                    onClick={() => setRegisterRole('ROLE_COMPANY')}
                  >
                    <Building2 size={16} /> Doanh nghiệp
                  </button>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Tên đăng nhập:</label>
                  <input
                    type="text"
                    className="form-input"
                    value={regData.username}
                    onChange={(e) => setRegData({ ...regData, username: e.target.value })}
                    placeholder="vd: an_nguyen"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email:</label>
                  <input
                    type="email"
                    className="form-input"
                    value={regData.email}
                    onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                    placeholder="email@domain.com"
                    required
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Họ và tên đầy đủ:</label>
                  <input
                    type="text"
                    className="form-input"
                    value={regData.fullName}
                    onChange={(e) => setRegData({ ...regData, fullName: e.target.value })}
                    placeholder="vd: Nguyễn Văn An"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Mật khẩu:</label>
                  <input
                    type="password"
                    className="form-input"
                    value={regData.password}
                    onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                    placeholder="Tối thiểu 6 ký tự"
                    required
                  />
                </div>
              </div>

              {registerRole === 'ROLE_STUDENT' ? (
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Mã số sinh viên (MSSV):</label>
                    <input
                      type="text"
                      className="form-input"
                      value={regData.studentCode}
                      onChange={(e) => setRegData({ ...regData, studentCode: e.target.value })}
                      placeholder="vd: 21020001"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Chuyên ngành:</label>
                    <input
                      type="text"
                      className="form-input"
                      value={regData.major}
                      onChange={(e) => setRegData({ ...regData, major: e.target.value })}
                      placeholder="vd: Công nghệ Thông tin"
                    />
                  </div>
                </div>
              ) : (
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Tên công ty / Doanh nghiệp:</label>
                    <input
                      type="text"
                      className="form-input"
                      value={regData.companyName}
                      onChange={(e) => setRegData({ ...regData, companyName: e.target.value })}
                      placeholder="vd: Viettel / FPT / VinAI"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Địa chỉ trụ sở:</label>
                    <input
                      type="text"
                      className="form-input"
                      value={regData.address}
                      onChange={(e) => setRegData({ ...regData, address: e.target.value })}
                      placeholder="vd: Cầu Giấy, Hà Nội"
                    />
                  </div>
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? 'Đang tạo tài khoản...' : 'Hoàn tất đăng ký'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
