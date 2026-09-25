import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Users, 
  Building2, 
  Briefcase, 
  FileText, 
  CheckCircle2, 
  Trash2, 
  Edit3,
  ToggleLeft, 
  ToggleRight, 
  TrendingUp, 
  BarChart3,
  Search,
  Check,
  XCircle,
  Clock,
  PlusCircle,
  Radio,
  Send,
  Sparkles,
  Layers,
  Bell,
  UploadCloud,
  Globe,
  GraduationCap,
  Mail,
  Phone,
  X,
  Save
} from 'lucide-react';
import { INITIAL_SKILLS, getCompanyLogoUrl } from '../api/mockData';

export default function AdminDashboard() {
  const { 
    allUsers, 
    jobs, 
    applications, 
    toggleUserStatus, 
    adminUpdateUser,
    deleteJob, 
    updateJob, 
    updateJobStatus,
    skillsList,
    addSkill,
    deleteSkill,
    sendBroadcastNotification
  } = useAuth();

  const [adminTab, setAdminTab] = useState('overview'); // 'overview', 'users', 'jobs', 'content'
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Job management filter & search
  const [jobSearch, setJobSearch] = useState('');
  const [jobStatusFilter, setJobStatusFilter] = useState('ALL');

  // Edit Job Modal State
  const [editingJob, setEditingJob] = useState(null);
  const [editJobForm, setEditJobForm] = useState({
    title: '',
    companyName: '',
    location: '',
    jobType: 'INTERNSHIP',
    salaryRange: '',
    slots: 1,
    deadline: '',
    status: 'ACTIVE',
    description: '',
    requirements: '',
    benefits: '',
    skills: [],
  });

  // Edit User Modal State
  const [editingUser, setEditingUser] = useState(null);
  const [editUserForm, setEditUserForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    avatar: '',
    role: 'ROLE_STUDENT',
    isActive: true,
    studentCode: '',
    university: '',
    major: '',
    gpa: 3.5,
    graduationYear: 2025,
    resumeUrl: '',
    companyName: '',
    address: '',
    website: '',
    industry: '',
    scale: '',
    description: '',
  });
  const [userSavedAlert, setUserSavedAlert] = useState(false);

  const handleOpenEditUserModal = (u) => {
    setEditingUser(u);
    setEditUserForm({
      fullName: u.fullName || '',
      email: u.email || '',
      phone: u.phone || '',
      avatar: u.avatar || '',
      role: u.role || 'ROLE_STUDENT',
      isActive: u.isActive !== false,
      studentCode: u.studentProfile?.studentCode || '21020001',
      university: u.studentProfile?.university || 'Đại học Công nghệ - ĐHQGHN (UET)',
      major: u.studentProfile?.major || 'Công nghệ Thông tin',
      gpa: u.studentProfile?.gpa || 3.68,
      graduationYear: u.studentProfile?.graduationYear || 2025,
      resumeUrl: u.studentProfile?.resumeUrl || '',
      companyName: u.companyProfile?.companyName || u.fullName || '',
      address: u.companyProfile?.address || '',
      website: u.companyProfile?.website || '',
      industry: u.companyProfile?.industry || 'Công nghệ thông tin',
      scale: u.companyProfile?.scale || '100+ nhân viên',
      description: u.companyProfile?.description || '',
    });
  };

  const handleSaveEditUser = (e) => {
    e.preventDefault();
    if (!editingUser) return;

    adminUpdateUser(editingUser.id, editUserForm);
    setEditingUser(null);
    setUserSavedAlert(true);
    setTimeout(() => setUserSavedAlert(false), 3000);
  };

  const handleAvatarUploadInModal = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Dung lượng ảnh không được vượt quá 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditUserForm((prev) => ({
          ...prev,
          avatar: event.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Content Management States
  const [newSkillName, setNewSkillName] = useState('');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const studentsCount = allUsers.filter((u) => u.role === 'ROLE_STUDENT').length;
  const companiesCount = allUsers.filter((u) => u.role === 'ROLE_COMPANY').length;
  const totalJobs = jobs.length;
  const totalApps = applications.length;
  const acceptedApps = applications.filter((a) => a.status === 'ACCEPTED').length;

  const filteredUsers = allUsers.filter((u) => {
    const matchSearch = !userSearch || 
      u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const filteredJobs = jobs.filter((j) => {
    const matchSearch = !jobSearch ||
      j.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
      j.companyName.toLowerCase().includes(jobSearch.toLowerCase()) ||
      j.location?.toLowerCase().includes(jobSearch.toLowerCase());
    const matchStatus = jobStatusFilter === 'ALL' || (j.status || 'ACTIVE') === jobStatusFilter;
    return matchSearch && matchStatus;
  });

  const handleOpenEditJob = (job) => {
    setEditingJob(job);
    setEditJobForm({
      title: job.title,
      companyName: job.companyName,
      location: job.location || 'Hà Nội',
      jobType: job.jobType || 'INTERNSHIP',
      salaryRange: job.salaryRange || 'Thỏa thuận',
      slots: job.slots || 1,
      deadline: job.deadline || '',
      status: job.status || 'ACTIVE',
      description: job.description || '',
      requirements: job.requirements || '',
      benefits: job.benefits || '',
      skills: job.skills || [],
    });
  };

  const handleSaveEditJob = async (e) => {
    e.preventDefault();
    if (!editingJob) return;
    await updateJob(editingJob.id, editJobForm);
    setEditingJob(null);
  };

  const toggleEditSkill = (skill) => {
    setEditJobForm((prev) => {
      const exists = prev.skills.includes(skill);
      return {
        ...prev,
        skills: exists ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill],
      };
    });
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkillName.trim()) {
      addSkill(newSkillName.trim());
      setNewSkillName('');
    }
  };

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    if (broadcastTitle.trim() && broadcastMessage.trim()) {
      sendBroadcastNotification(broadcastTitle, broadcastMessage);
      setBroadcastTitle('');
      setBroadcastMessage('');
      setBroadcastSuccess(true);
      setTimeout(() => setBroadcastSuccess(false), 3000);
    }
  };

  return (
    <div className="admin-dashboard container">
      {/* Header */}
      <div className="admin-header-box">
        <div className="admin-header-title">
          <div className="admin-icon-badge">
            <ShieldCheck size={26} />
          </div>
          <div>
            <h1>Trung Tâm Quản Trị Hệ Thống InternHub</h1>
            <p className="admin-sub">
              Giám sát toàn bộ hoạt động tuyển dụng, duyệt tin, quản lý tài khoản và nội dung hệ sinh thái UET
            </p>
          </div>
        </div>

        {/* Tab buttons */}
        <div className="admin-tabs">
          <button
            className={`admin-tab-btn ${adminTab === 'overview' ? 'active' : ''}`}
            onClick={() => setAdminTab('overview')}
          >
            <BarChart3 size={16} /> Tổng quan số liệu
          </button>
          <button
            className={`admin-tab-btn ${adminTab === 'users' ? 'active' : ''}`}
            onClick={() => setAdminTab('users')}
          >
            <Users size={16} /> Quản lý người dùng ({allUsers.length})
          </button>
          <button
            className={`admin-tab-btn ${adminTab === 'jobs' ? 'active' : ''}`}
            onClick={() => setAdminTab('jobs')}
          >
            <Briefcase size={16} /> Duyệt & Quản lý tin ({jobs.length})
          </button>
          <button
            className={`admin-tab-btn ${adminTab === 'content' ? 'active' : ''}`}
            onClick={() => setAdminTab('content')}
          >
            <Layers size={16} /> Quản lý nội dung hệ thống
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW & STATS */}
      {adminTab === 'overview' && (
        <div className="admin-overview-view">
          <div className="metric-cards-grid">
            <div className="metric-card">
              <div className="metric-icon-wrap bg-blue">
                <Users size={24} />
              </div>
              <div className="metric-content">
                <span className="metric-num">{studentsCount}</span>
                <span className="metric-label">Sinh viên đăng ký</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-wrap bg-purple">
                <Building2 size={24} />
              </div>
              <div className="metric-content">
                <span className="metric-num">{companiesCount}</span>
                <span className="metric-label">Doanh nghiệp đối tác</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-wrap bg-amber">
                <Briefcase size={24} />
              </div>
              <div className="metric-content">
                <span className="metric-num">{totalJobs}</span>
                <span className="metric-label">Tin tuyển dụng hoạt động</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-wrap bg-emerald">
                <FileText size={24} />
              </div>
              <div className="metric-content">
                <span className="metric-num">{totalApps}</span>
                <span className="metric-label">Tổng lượt ứng tuyển</span>
              </div>
            </div>
          </div>

          <div className="breakdown-grid">
            <div className="breakdown-card">
              <h3>Phân Bố Trạng Thái Ứng Tuyển</h3>
              <div className="breakdown-list">
                <div className="breakdown-item">
                  <div className="item-label-row">
                    <span>Đã nộp (APPLIED)</span>
                    <strong>{applications.filter((a) => a.status === 'APPLIED').length}</strong>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill bg-blue"
                      style={{ width: `${(applications.filter((a) => a.status === 'APPLIED').length / (totalApps || 1)) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="breakdown-item">
                  <div className="item-label-row">
                    <span>Đang duyệt (REVIEWING)</span>
                    <strong>{applications.filter((a) => a.status === 'REVIEWING').length}</strong>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill bg-purple"
                      style={{ width: `${(applications.filter((a) => a.status === 'REVIEWING').length / (totalApps || 1)) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="breakdown-item">
                  <div className="item-label-row">
                    <span>Mời phỏng vấn (INTERVIEW)</span>
                    <strong>{applications.filter((a) => a.status === 'INTERVIEW').length}</strong>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill bg-amber"
                      style={{ width: `${(applications.filter((a) => a.status === 'INTERVIEW').length / (totalApps || 1)) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="breakdown-item">
                  <div className="item-label-row">
                    <span>Trúng tuyển (ACCEPTED)</span>
                    <strong>{acceptedApps}</strong>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill bg-emerald"
                      style={{ width: `${(acceptedApps / (totalApps || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="breakdown-card">
              <h3>Đánh Giá Hiệu Quả Tuyển Dụng</h3>
              <div className="efficiency-stats">
                <div className="eff-box">
                  <span className="eff-big">{totalApps > 0 ? Math.round((acceptedApps / totalApps) * 100) : 0}%</span>
                  <span className="eff-desc">Tỷ lệ sinh viên trúng tuyển thực tập</span>
                </div>
                <div className="eff-box">
                  <span className="eff-big">{totalJobs > 0 ? (totalApps / totalJobs).toFixed(1) : 0}</span>
                  <span className="eff-desc">Lượt ứng tuyển trung bình / 1 vị trí</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT */}
      {adminTab === 'users' && (
        <div className="admin-users-view">
          <div className="search-filter-card">
            <div className="filter-row-top">
              <div className="search-input-wrap">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Tìm kiếm theo họ tên, username hoặc email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>

              <div className="select-wrap">
                <select
                  className="filter-select"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="ALL">Tất cả vai trò (Role)</option>
                  <option value="ROLE_STUDENT">Sinh viên</option>
                  <option value="ROLE_COMPANY">Doanh nghiệp</option>
                  <option value="ROLE_ADMIN">Quản trị viên</option>
                </select>
              </div>
            </div>
          </div>

          {userSavedAlert && (
            <div className="alert-banner alert-success mb-4" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', background: '#ecfdf5', color: '#065f46', borderRadius: '8px', border: '1px solid #a7f3d0', marginBottom: '16px' }}>
              <CheckCircle2 size={18} />
              <span>Đã cập nhật thông tin và hồ sơ người dùng thành công!</span>
            </div>
          )}

          <div className="table-responsive-card">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Người dùng</th>
                  <th>Vai trò</th>
                  <th>Email & SĐT</th>
                  <th>Thông tin bổ sung</th>
                  <th>Trạng thái</th>
                  <th style={{ textAlign: 'center' }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="user-table-cell">
                        <img
                          src={
                            u.role === 'ROLE_COMPANY'
                              ? getCompanyLogoUrl(u.companyProfile?.companyName || u.fullName, u.avatar || u.companyProfile?.logoUrl)
                              : (u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80')
                          }
                          alt={u.fullName}
                          className="user-mini-avatar"
                          onError={(e) => {
                            e.currentTarget.src = u.role === 'ROLE_COMPANY' 
                              ? '/logos/default-company.svg' 
                              : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80';
                          }}
                        />
                        <div>
                          <strong>{u.fullName}</strong>
                          <span className="cell-sub">@{u.username}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`role-tag role_${u.role ? u.role.replace('ROLE_', '').toLowerCase() : 'student'}`}>
                        {u.role === 'ROLE_ADMIN' && 'Admin'}
                        {u.role === 'ROLE_COMPANY' && 'Doanh nghiệp'}
                        {u.role === 'ROLE_STUDENT' && 'Sinh viên'}
                      </span>
                    </td>
                    <td>
                      <div className="contact-cell">
                        <span>{u.email}</span>
                        <span className="cell-sub">{u.phone || 'Chưa cập nhật'}</span>
                      </div>
                    </td>
                    <td>
                      {u.role === 'ROLE_STUDENT' && (
                        <span>MSSV: {u.studentProfile?.studentCode || '21020001'} (GPA: {u.studentProfile?.gpa || '3.6'})</span>
                      )}
                      {u.role === 'ROLE_COMPANY' && (
                        <span>{u.companyProfile?.companyName || u.fullName}</span>
                      )}
                      {u.role === 'ROLE_ADMIN' && (
                        <span className="text-muted">Quản trị hệ thống</span>
                      )}
                    </td>
                    <td>
                      <span className={`status-pill ${u.isActive !== false ? 'accepted' : 'rejected'}`}>
                        {u.isActive !== false ? 'Hoạt động' : 'Tạm khóa'}
                      </span>
                    </td>
                    <td>
                      <div className="user-actions-cell" style={{ justifyContent: 'center' }}>
                        <button
                          className="btn-outline-sm"
                          onClick={() => handleOpenEditUserModal(u)}
                          title="Chỉnh sửa chi tiết hồ sơ người dùng"
                        >
                          <Edit3 size={14} /> Sửa
                        </button>
                        <button
                          className={`btn-toggle ${u.isActive !== false ? 'active' : ''}`}
                          onClick={() => toggleUserStatus(u.id)}
                          title="Bật/Tắt hoạt động tài khoản"
                        >
                          {u.isActive !== false ? (
                            <><ToggleRight size={18} className="text-success" /> Khóa</>
                          ) : (
                            <><ToggleLeft size={18} className="text-muted" /> Mở khóa</>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: JOBS MODERATION & APPROVAL & EDIT */}
      {adminTab === 'jobs' && (
        <div className="admin-jobs-view">
          {/* Filter Bar */}
          <div className="search-filter-card">
            <div className="filter-row-top">
              <div className="search-input-wrap">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Tìm tin theo tiêu đề, công ty, địa điểm..."
                  value={jobSearch}
                  onChange={(e) => setJobSearch(e.target.value)}
                />
              </div>

              <div className="select-wrap">
                <select
                  className="filter-select"
                  value={jobStatusFilter}
                  onChange={(e) => setJobStatusFilter(e.target.value)}
                >
                  <option value="ALL">Tất cả trạng thái tin</option>
                  <option value="ACTIVE">Đã duyệt / Đang mở (ACTIVE)</option>
                  <option value="PENDING_APPROVAL">Chờ xét duyệt (PENDING)</option>
                  <option value="CLOSED">Tạm đóng / Đã hết hạn (CLOSED)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="table-responsive-card">
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: '28%' }}>Vị trí tuyển dụng</th>
                  <th style={{ width: '18%' }}>Doanh nghiệp</th>
                  <th style={{ width: '16%' }}>Địa điểm & Hình thức</th>
                  <th style={{ width: '14%' }}>Trợ cấp</th>
                  <th className="text-center" style={{ width: '10%', whiteSpace: 'nowrap' }}>Trạng thái</th>
                  <th className="text-center" style={{ width: '8%', whiteSpace: 'nowrap' }}>Lượt nộp</th>
                  <th className="text-center" style={{ width: '16%', whiteSpace: 'nowrap' }}>Hành động (Duyệt / Sửa / Xóa)</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((j) => {
                  const status = j.status || 'ACTIVE';
                  return (
                    <tr key={j.id}>
                      <td>
                        <strong>{j.title}</strong>
                        <div className="skills-mini-list">
                          {j.skills && j.skills.slice(0, 3).map((s, idx) => (
                            <span key={idx} className="skill-mini-chip">{s}</span>
                          ))}
                        </div>
                        <span className="cell-sub">Hạn nộp: {j.deadline}</span>
                      </td>
                      <td>
                        <strong>{j.companyName}</strong>
                      </td>
                      <td>
                        {j.location} • {j.jobType}
                      </td>
                      <td>{j.salaryRange}</td>
                      <td className="text-center">
                        <span className={`status-pill ${status.toLowerCase()}`}>
                          {status === 'ACTIVE' && 'Đã duyệt (Mở)'}
                          {status === 'PENDING_APPROVAL' && 'Chờ xét duyệt'}
                          {status === 'CLOSED' && 'Đã đóng'}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className="badge-count-pill">{j.applicationsCount || 0} hồ sơ</span>
                      </td>
                      <td className="text-center">
                        <div className="action-buttons-group center">
                          {/* NÚT PHÊ DUYỆT / ĐỔI TRẠNG THÁI */}
                          {status === 'PENDING_APPROVAL' ? (
                            <button
                              className="btn btn-primary-sm"
                              onClick={() => updateJobStatus(j.id, 'ACTIVE')}
                              title="Phê duyệt tin này"
                            >
                              <Check size={14} /> Duyệt
                            </button>
                          ) : status === 'ACTIVE' ? (
                            <button
                              className="btn btn-outline-sm"
                              onClick={() => updateJobStatus(j.id, 'CLOSED')}
                              title="Tạm đóng tin tuyển dụng"
                            >
                              <XCircle size={14} /> Đóng
                            </button>
                          ) : (
                            <button
                              className="btn btn-primary-sm"
                              onClick={() => updateJobStatus(j.id, 'ACTIVE')}
                              title="Kích hoạt lại tin"
                            >
                              <Check size={14} /> Mở lại
                            </button>
                          )}

                          {/* NÚT CHỈNH SỬA TIN */}
                          <button
                            className="btn btn-outline-sm"
                            onClick={() => handleOpenEditJob(j)}
                            title="Chỉnh sửa chi tiết tin tuyển dụng"
                          >
                            <Edit3 size={14} /> Sửa
                          </button>

                          {/* NÚT XÓA TIN */}
                          <button
                            className="btn-icon-danger"
                            onClick={() => deleteJob(j.id)}
                            title="Xóa tin tuyển dụng này"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CONTENT MANAGEMENT (Kỹ năng, Thông báo) */}
      {adminTab === 'content' && (
        <div className="admin-content-management-view">
          <div className="breakdown-grid">
            {/* Box 1: Quản lý danh mục kỹ năng */}
            <div className="breakdown-card">
              <h3>
                <Sparkles size={18} className="text-warning" /> Quản Lý Danh Mục Kỹ Năng (Skills)
              </h3>
              <p className="cell-sub" style={{ marginBottom: '14px' }}>
                Danh mục kỹ năng phục vụ lọc việc làm, tạo hồ sơ sinh viên và yêu cầu của doanh nghiệp.
              </p>

              <form onSubmit={handleAddSkill} className="add-skill-form-row">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Nhập tên kỹ năng mới (vd: GraphQL, Golang, Flutter)..."
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">
                  <PlusCircle size={16} /> Thêm Kỹ Năng
                </button>
              </form>

              <div className="skills-admin-list" style={{ marginTop: '16px' }}>
                {(skillsList || INITIAL_SKILLS).map((sk) => (
                  <span key={sk} className="skill-admin-tag">
                    {sk}
                    <button
                      type="button"
                      className="skill-remove-btn"
                      onClick={() => deleteSkill(sk)}
                      title="Xóa kỹ năng này"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Box 2: Phát thông báo toàn hệ thống */}
            <div className="breakdown-card">
              <h3>
                <Bell size={18} className="text-primary" /> Phát Thông Báo Toàn Hệ Thống
              </h3>
              <p className="cell-sub" style={{ marginBottom: '14px' }}>
                Gửi thông báo đẩy tới toàn bộ tài khoản Sinh viên và Doanh nghiệp trên InternHub.
              </p>

              {broadcastSuccess && (
                <div className="alert alert-success">
                  <CheckCircle2 size={16} /> Đã phát thông báo tới tất cả người dùng thành công!
                </div>
              )}

              <form onSubmit={handleSendBroadcast} className="broadcast-form">
                <div className="form-group">
                  <label className="form-label">Tiêu đề thông báo:</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="vd: Khai mạc Ngày hội Việc làm UET Job Fair 2026..."
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Nội dung chi tiết:</label>
                  <textarea
                    rows={4}
                    className="form-textarea"
                    placeholder="Nội dung thông báo tới sinh viên và nhà tuyển dụng..."
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  <Send size={15} /> Gửi Thông Báo Toàn Mạng Lưới
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CHỈNH SỬA TIN TUYỂN DỤNG (EDIT JOB MODAL) */}
      {editingJob && (
        <div className="modal-overlay" onClick={() => setEditingJob(null)}>
          <div className="modal-content modal-lg animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                <Edit3 size={20} className="text-primary" /> Chỉnh sửa tin tuyển dụng #{editingJob.id}
              </h3>
              <button className="modal-close-btn" onClick={() => setEditingJob(null)}>
                <XCircle size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEditJob}>
              <div className="modal-body">
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Tiêu đề công việc:</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editJobForm.title}
                      onChange={(e) => setEditJobForm({ ...editJobForm, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tên doanh nghiệp:</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editJobForm.companyName}
                      onChange={(e) => setEditJobForm({ ...editJobForm, companyName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-grid-3">
                  <div className="form-group">
                    <label className="form-label">Hình thức làm việc:</label>
                    <select
                      className="form-select"
                      value={editJobForm.jobType}
                      onChange={(e) => setEditJobForm({ ...editJobForm, jobType: e.target.value })}
                    >
                      <option value="INTERNSHIP">Thực tập sinh (Intern)</option>
                      <option value="FULL_TIME">Toàn thời gian (Full-time)</option>
                      <option value="PART_TIME">Bán thời gian (Part-time)</option>
                      <option value="REMOTE">Làm việc từ xa (Remote)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Trợ cấp / Lương:</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editJobForm.salaryRange}
                      onChange={(e) => setEditJobForm({ ...editJobForm, salaryRange: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Trạng thái tin:</label>
                    <select
                      className="form-select"
                      value={editJobForm.status}
                      onChange={(e) => setEditJobForm({ ...editJobForm, status: e.target.value })}
                    >
                      <option value="ACTIVE">Đã duyệt / Đang công khai (ACTIVE)</option>
                      <option value="PENDING_APPROVAL">Chờ xét duyệt (PENDING)</option>
                      <option value="CLOSED">Đã đóng / Tạm dừng (CLOSED)</option>
                    </select>
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Địa điểm làm việc:</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editJobForm.location}
                      onChange={(e) => setEditJobForm({ ...editJobForm, location: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Hạn nộp hồ sơ:</label>
                    <input
                      type="date"
                      className="form-input"
                      value={editJobForm.deadline}
                      onChange={(e) => setEditJobForm({ ...editJobForm, deadline: e.target.value })}
                    />
                  </div>
                </div>

                {/* Skills selection */}
                <div className="form-group">
                  <label className="form-label">Kỹ năng yêu cầu:</label>
                  <div className="skills-selectable-grid">
                    {(skillsList || INITIAL_SKILLS).map((sk) => {
                      const selected = editJobForm.skills.includes(sk);
                      return (
                        <button
                          key={sk}
                          type="button"
                          className={`skill-select-chip ${selected ? 'active' : ''}`}
                          onClick={() => toggleEditSkill(sk)}
                        >
                          {sk}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Mô tả công việc:</label>
                  <textarea
                    rows={4}
                    className="form-textarea"
                    value={editJobForm.description}
                    onChange={(e) => setEditJobForm({ ...editJobForm, description: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Yêu cầu ứng viên:</label>
                  <textarea
                    rows={4}
                    className="form-textarea"
                    value={editJobForm.requirements}
                    onChange={(e) => setEditJobForm({ ...editJobForm, requirements: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Quyền lợi:</label>
                  <textarea
                    rows={3}
                    className="form-textarea"
                    value={editJobForm.benefits}
                    onChange={(e) => setEditJobForm({ ...editJobForm, benefits: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingJob(null)}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle2 size={16} /> Lưu thay đổi tin tuyển dụng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL FOR ADMIN */}
      {editingUser && (
        <div className="modal-overlay" onClick={() => setEditingUser(null)}>
          <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  <Users size={22} />
                </div>
                <div>
                  <h3 className="modal-title">Chỉnh sửa hồ sơ người dùng</h3>
                  <p className="modal-subtitle">
                    Tài khoản: <strong>{editingUser.fullName}</strong> (@{editingUser.username}) • ID: #{editingUser.id}
                  </p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setEditingUser(null)} title="Đóng">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEditUser}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* 1. Account General Info */}
                <div className="admin-edit-section">
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={18} className="text-primary" /> Thông tin tài khoản & Quyền hạn
                  </h4>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Họ và tên / Tên hiển thị:</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editUserForm.fullName}
                        onChange={(e) => setEditUserForm({ ...editUserForm, fullName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email đăng nhập & liên hệ:</label>
                      <input
                        type="email"
                        className="form-input"
                        value={editUserForm.email}
                        onChange={(e) => setEditUserForm({ ...editUserForm, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-grid-3">
                    <div className="form-group">
                      <label className="form-label">Số điện thoại:</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editUserForm.phone}
                        onChange={(e) => setEditUserForm({ ...editUserForm, phone: e.target.value })}
                        placeholder="0988xxxxxx"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Vai trò hệ thống:</label>
                      <select
                        className="form-select"
                        value={editUserForm.role}
                        onChange={(e) => setEditUserForm({ ...editUserForm, role: e.target.value })}
                      >
                        <option value="ROLE_STUDENT">Sinh viên ứng tuyển (ROLE_STUDENT)</option>
                        <option value="ROLE_COMPANY">Doanh nghiệp tuyển dụng (ROLE_COMPANY)</option>
                        <option value="ROLE_ADMIN">Quản trị viên (ROLE_ADMIN)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Trạng thái tài khoản:</label>
                      <select
                        className="form-select"
                        value={editUserForm.isActive ? 'true' : 'false'}
                        onChange={(e) => setEditUserForm({ ...editUserForm, isActive: e.target.value === 'true' })}
                      >
                        <option value="true">Đang hoạt động (Active)</option>
                        <option value="false">Tạm khóa / Vô hiệu hóa (Locked)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2. Avatar / Logo */}
                <div className="admin-edit-section">
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UploadCloud size={18} className="text-primary" /> Ảnh đại diện / Logo doanh nghiệp
                  </h4>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ width: '60px', height: '60px', minWidth: '60px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', boxShadow: 'var(--shadow-sm)' }}>
                      <img
                        src={editUserForm.avatar || (editUserForm.role === 'ROLE_COMPANY' ? '/logos/default-company.svg' : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80')}
                        alt="Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        onError={(e) => {
                          e.currentTarget.src = '/logos/default-company.svg';
                        }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: '240px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Dán đường link ảnh đại diện hoặc logo (URL)..."
                        value={editUserForm.avatar}
                        onChange={(e) => setEditUserForm({ ...editUserForm, avatar: e.target.value })}
                      />
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <label className="btn btn-secondary" style={{ cursor: 'pointer', padding: '6px 12px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                          <UploadCloud size={14} /> Tải ảnh lên từ máy
                          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUploadInModal} />
                        </label>
                        {editUserForm.role === 'ROLE_COMPANY' && (
                          <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Logo mẫu:</span>
                            <button type="button" className="filter-chip" onClick={() => setEditUserForm({ ...editUserForm, avatar: '/logos/fpt.svg' })}>FPT</button>
                            <button type="button" className="filter-chip" onClick={() => setEditUserForm({ ...editUserForm, avatar: '/logos/viettel.svg' })}>Viettel</button>
                            <button type="button" className="filter-chip" onClick={() => setEditUserForm({ ...editUserForm, avatar: '/logos/techcorp.svg' })}>TechCorp</button>
                            <button type="button" className="filter-chip" onClick={() => setEditUserForm({ ...editUserForm, avatar: '/logos/vng.svg' })}>VNG</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Role-specific Profiles */}
                {editUserForm.role === 'ROLE_STUDENT' && (
                  <div className="admin-edit-section" style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <GraduationCap size={18} className="text-primary" /> Hồ sơ học tập sinh viên
                    </h4>
                    <div className="form-grid-3">
                      <div className="form-group">
                        <label className="form-label">Mã số sinh viên (MSSV):</label>
                        <input
                          type="text"
                          className="form-input"
                          value={editUserForm.studentCode}
                          onChange={(e) => setEditUserForm({ ...editUserForm, studentCode: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Điểm trung bình tích lũy (GPA):</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max="4"
                          className="form-input"
                          value={editUserForm.gpa}
                          onChange={(e) => setEditUserForm({ ...editUserForm, gpa: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Năm tốt nghiệp dự kiến:</label>
                        <input
                          type="number"
                          className="form-input"
                          value={editUserForm.graduationYear}
                          onChange={(e) => setEditUserForm({ ...editUserForm, graduationYear: parseInt(e.target.value, 10) || 2025 })}
                        />
                      </div>
                    </div>
                    <div className="form-grid-2" style={{ marginTop: '10px' }}>
                      <div className="form-group">
                        <label className="form-label">Trường Đại học:</label>
                        <input
                          type="text"
                          className="form-input"
                          value={editUserForm.university}
                          onChange={(e) => setEditUserForm({ ...editUserForm, university: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Chuyên ngành đào tạo:</label>
                        <input
                          type="text"
                          className="form-input"
                          value={editUserForm.major}
                          onChange={(e) => setEditUserForm({ ...editUserForm, major: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="form-group" style={{ marginTop: '10px' }}>
                      <label className="form-label">Đường dẫn file CV / Resume đính kèm:</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="https://drive.google.com/... hoặc link CV"
                        value={editUserForm.resumeUrl}
                        onChange={(e) => setEditUserForm({ ...editUserForm, resumeUrl: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {editUserForm.role === 'ROLE_COMPANY' && (
                  <div className="admin-edit-section" style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Building2 size={18} className="text-primary" /> Thông tin hồ sơ doanh nghiệp
                    </h4>
                    <div className="form-grid-2">
                      <div className="form-group">
                        <label className="form-label">Tên đầy đủ của Doanh nghiệp:</label>
                        <input
                          type="text"
                          className="form-input"
                          value={editUserForm.companyName}
                          onChange={(e) => setEditUserForm({ ...editUserForm, companyName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Website công ty:</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="https://..."
                          value={editUserForm.website}
                          onChange={(e) => setEditUserForm({ ...editUserForm, website: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="form-grid-2" style={{ marginTop: '10px' }}>
                      <div className="form-group">
                        <label className="form-label">Lĩnh vực hoạt động:</label>
                        <input
                          type="text"
                          className="form-input"
                          value={editUserForm.industry}
                          onChange={(e) => setEditUserForm({ ...editUserForm, industry: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Quy mô nhân sự:</label>
                        <input
                          type="text"
                          className="form-input"
                          value={editUserForm.scale}
                          onChange={(e) => setEditUserForm({ ...editUserForm, scale: e.target.value })}
                          placeholder="Ví dụ: 500+ nhân viên"
                        />
                      </div>
                    </div>
                    <div className="form-group" style={{ marginTop: '10px' }}>
                      <label className="form-label">Địa chỉ trụ sở / Chi nhánh:</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editUserForm.address}
                        onChange={(e) => setEditUserForm({ ...editUserForm, address: e.target.value })}
                      />
                    </div>
                    <div className="form-group" style={{ marginTop: '10px' }}>
                      <label className="form-label">Giới thiệu tổng quan về Doanh nghiệp:</label>
                      <textarea
                        rows={3}
                        className="form-textarea"
                        value={editUserForm.description}
                        onChange={(e) => setEditUserForm({ ...editUserForm, description: e.target.value })}
                        placeholder="Mô tả các sản phẩm, văn hóa làm việc và cơ hội thực tập..."
                      />
                    </div>
                  </div>
                )}

              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingUser(null)}>
                  Hủy bỏ
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} /> Lưu cập nhật hồ sơ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
