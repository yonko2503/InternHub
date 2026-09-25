import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, 
  User, 
  Building2, 
  ShieldCheck, 
  Bell, 
  LogOut, 
  Search, 
  Menu, 
  X,
  FileText,
  PlusCircle,
  BarChart3,
  Sparkles
} from 'lucide-react';
import Logo from './Logo';

export default function Navbar({ activeTab, setActiveTab, onOpenAuth, onOpenNotifs }) {
  const { user, role, isLoggedIn, logout, notifications } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="navbar-container">
      {/* Top Recruitment Running Ticker */}
      <div className="recruitment-ticker-bar">
        <div className="container ticker-container">
          <div className="ticker-badge">
            <Sparkles size={14} className="icon-pulse" /> TIN TUYỂN DỤNG MỚI
          </div>
          <div className="ticker-marquee-wrap">
            <div className="ticker-track">
              <span className="ticker-item">
                🔥 <strong>FPT Software:</strong> Tuyển 5 Thực tập sinh Backend Java (Spring Boot) - Trợ cấp 6 - 8 triệu VNĐ/tháng
              </span>
              <span className="ticker-divider">•</span>
              <span className="ticker-item">
                🚀 <strong>Viettel Solutions:</strong> Tuyển AI & Data Science Engineering Intern - Trợ cấp tới 12 triệu VNĐ/tháng
              </span>
              <span className="ticker-divider">•</span>
              <span className="ticker-item">
                💎 <strong>TechCorp Lab:</strong> Tuyển Frontend ReactJS Intern (Trang bị MacBook Pro & Hybrid WFH)
              </span>
              <span className="ticker-divider">•</span>
              <span className="ticker-item">
                🎓 <strong>UET Career:</strong> Hơn 350+ cơ hội thực tập doanh nghiệp đang mở - Nộp hồ sơ xét duyệt trực tuyến ngay hôm nay!
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="main-nav">
        <div className="container nav-content">
          {/* Logo */}
          <Logo onClick={() => setActiveTab('home')} />

          {/* Nav Links */}
          <nav className="nav-links">
            <button
              className={`nav-link-btn ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => setActiveTab('home')}
            >
              Trang chủ
            </button>
            <button
              className={`nav-link-btn ${activeTab === 'jobs' ? 'active' : ''}`}
              onClick={() => setActiveTab('jobs')}
            >
              Việc làm thực tập
            </button>
            <button
              className={`nav-link-btn ${activeTab === 'companies' ? 'active' : ''}`}
              onClick={() => setActiveTab('companies')}
            >
              Doanh nghiệp
            </button>

            {/* Role specific links */}
            {role === 'ROLE_STUDENT' && (
              <button
                className={`nav-link-btn highlight ${activeTab === 'student-dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('student-dashboard')}
              >
                <FileText size={16} /> Đơn ứng tuyển của tôi
              </button>
            )}

            {role === 'ROLE_COMPANY' && (
              <button
                className={`nav-link-btn highlight ${activeTab === 'company-dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('company-dashboard')}
              >
                <Building2 size={16} /> Quản lý tuyển dụng
              </button>
            )}

            {role === 'ROLE_ADMIN' && (
              <button
                className={`nav-link-btn highlight-admin ${activeTab === 'admin-dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('admin-dashboard')}
              >
                <ShieldCheck size={16} /> Bảng quản trị
              </button>
            )}
          </nav>

          {/* Right Action Icons & User */}
          <div className="nav-actions">
            {isLoggedIn ? (
              <>
                {/* Notification Bell */}
                <button className="icon-btn" onClick={onOpenNotifs} title="Thông báo">
                  <Bell size={20} />
                  {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
                </button>

                {/* Profile Pill */}
                <div className="user-profile-menu">
                  <div
                    className="user-pill"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  >
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80'}
                      alt={user.fullName}
                      className="user-avatar"
                    />
                    <div className="user-info-text">
                      <span className="user-name">{user.fullName}</span>
                      <span className="user-role-badge">
                        {role === 'ROLE_ADMIN' && 'Admin'}
                        {role === 'ROLE_COMPANY' && 'Doanh nghiệp'}
                        {role === 'ROLE_STUDENT' && 'Sinh viên'}
                      </span>
                    </div>
                  </div>

                  {profileDropdownOpen && (
                    <div className="profile-dropdown" onClick={() => setProfileDropdownOpen(false)}>
                      <button
                        className="dropdown-item"
                        onClick={() => setActiveTab('profile')}
                      >
                        <User size={16} /> Hồ sơ cá nhân
                      </button>
                      {role === 'ROLE_STUDENT' && (
                        <button
                          className="dropdown-item"
                          onClick={() => setActiveTab('student-dashboard')}
                        >
                          <FileText size={16} /> Đơn ứng tuyển
                        </button>
                      )}
                      {role === 'ROLE_COMPANY' && (
                        <button
                          className="dropdown-item"
                          onClick={() => setActiveTab('company-dashboard')}
                        >
                          <Building2 size={16} /> Quản lý ứng viên
                        </button>
                      )}
                      {role === 'ROLE_ADMIN' && (
                        <button
                          className="dropdown-item"
                          onClick={() => setActiveTab('admin-dashboard')}
                        >
                          <BarChart3 size={16} /> Thống kê & Người dùng
                        </button>
                      )}
                      <div className="dropdown-divider" />
                      <button className="dropdown-item text-danger" onClick={logout}>
                        <LogOut size={16} /> Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="auth-buttons">
                <button className="btn btn-secondary" onClick={() => onOpenAuth('login')}>
                  Đăng nhập
                </button>
                <button className="btn btn-primary" onClick={() => onOpenAuth('register')}>
                  Đăng ký
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
