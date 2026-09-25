import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  PlusCircle, 
  Users, 
  Briefcase, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  Video, 
  XCircle, 
  ExternalLink, 
  Calendar, 
  Send,
  Eye,
  Filter,
  FileText,
  DollarSign,
  MapPin,
  Sparkles,
  Mail,
  Phone,
  GraduationCap
} from 'lucide-react';
import { INITIAL_SKILLS } from '../api/mockData';

export default function CompanyDashboard() {
  const { user, jobs, applications, createJob, updateJob, deleteJob, updateApplicationStatus } = useAuth();
  const [activeTab, setActiveTab] = useState('candidates'); // 'candidates' or 'jobs'

  // Modals state
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [editingCompanyJob, setEditingCompanyJob] = useState(null);
  const [editCompanyJobForm, setEditCompanyJobForm] = useState({
    title: '',
    jobType: 'INTERNSHIP',
    salaryRange: '',
    location: '',
    slots: 2,
    deadline: '',
    description: '',
    requirements: '',
    benefits: '',
    skills: [],
  });
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [filterJobId, setFilterJobId] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Job form state
  const [jobForm, setJobForm] = useState({
    title: '',
    jobType: 'INTERNSHIP',
    salaryRange: '6.000.000 - 8.000.000 VNĐ / tháng',
    location: 'Hà Nội',
    slots: 2,
    deadline: '2026-11-30',
    description: '',
    requirements: '',
    benefits: '',
    skills: ['Java', 'Spring Boot', 'MySQL'],
  });

  // Candidate review form state
  const [reviewStatus, setReviewStatus] = useState('REVIEWING');
  const [reviewFeedback, setReviewFeedback] = useState('');
  const [interviewTime, setInterviewTime] = useState('2026-10-02T14:00');
  const [interviewLocation, setInterviewLocation] = useState('Google Meet: https://meet.google.com/internhub-uet-interview');
  const [interviewNotes, setInterviewNotes] = useState('Chuẩn bị giới thiệu đồ án và kiến thức kỹ thuật cơ bản.');

  // Filter jobs strictly for current company (Admin can view all)
  const companyJobs = jobs.filter((j) => {
    if (!user) return false;
    if (user.role === 'ROLE_ADMIN') return true;

    const cName = (user.companyProfile?.companyName || user.fullName || user.username || '').toLowerCase().trim();
    const jComp = (j.companyName || '').toLowerCase().trim();
    const jTitle = (j.title || '').toLowerCase().trim();

    // Strict isolation for standard companies
    if (cName.includes('viettel') || user.username?.includes('viettel')) {
      if (jComp.includes('fpt') || jComp.includes('techcorp') || jTitle.includes('fpt') || jTitle.includes('techcorp')) {
        return false;
      }
      return j.companyId === 4 || j.companyId === user.id || jComp.includes('viettel') || jTitle.includes('viettel');
    }

    if (cName.includes('fpt') || user.username?.includes('fpt')) {
      if (jComp.includes('viettel') || jComp.includes('techcorp') || jTitle.includes('viettel') || jTitle.includes('techcorp')) {
        return false;
      }
      return j.companyId === 2 || j.companyId === user.id || jComp.includes('fpt') || jTitle.includes('fpt');
    }

    if (cName.includes('techcorp') || user.username?.includes('techcorp')) {
      if (jComp.includes('viettel') || jComp.includes('fpt') || jTitle.includes('viettel') || jTitle.includes('fpt')) {
        return false;
      }
      return j.companyId === 3 || j.companyId === user.id || jComp.includes('techcorp') || jTitle.includes('techcorp');
    }

    // Generic matching for newly registered companies
    if (j.companyId && (j.companyId === user.id || (user.companyProfile?.id && j.companyId === user.companyProfile.id))) {
      return true;
    }
    if (cName && jComp && (cName === jComp || cName.includes(jComp) || jComp.includes(cName))) {
      return true;
    }

    return false;
  });

  const companyJobIds = new Set(companyJobs.map((j) => j.id));

  // Applications strictly for this company
  const companyApplications = applications.filter((a) => {
    if (!user) return false;
    if (user.role === 'ROLE_ADMIN') return true;

    // Must be linked to one of this company's jobs
    if (companyJobIds.has(a.jobId)) return true;

    const cName = (user.companyProfile?.companyName || user.fullName || user.username || '').toLowerCase().trim();
    const aComp = (a.companyName || '').toLowerCase().trim();
    const aJobTitle = (a.jobTitle || '').toLowerCase().trim();

    if (cName.includes('viettel') || user.username?.includes('viettel')) {
      if (aComp.includes('fpt') || aComp.includes('techcorp')) return false;
      return aComp.includes('viettel') || aJobTitle.includes('viettel');
    }
    if (cName.includes('fpt') || user.username?.includes('fpt')) {
      if (aComp.includes('viettel') || aComp.includes('techcorp')) return false;
      return aComp.includes('fpt') || aJobTitle.includes('fpt');
    }
    if (cName.includes('techcorp') || user.username?.includes('techcorp')) {
      if (aComp.includes('viettel') || aComp.includes('fpt')) return false;
      return aComp.includes('techcorp') || aJobTitle.includes('techcorp');
    }

    if (cName && aComp && (cName === aComp || cName.includes(aComp) || aComp.includes(cName))) {
      return true;
    }
    return false;
  });

  const stats = {
    totalJobs: companyJobs.length,
    totalCandidates: companyApplications.length,
    interviewing: companyApplications.filter((a) => a.status === 'INTERVIEW').length,
    accepted: companyApplications.filter((a) => a.status === 'ACCEPTED').length,
  };

  const filteredApplications = companyApplications.filter((a) => {
    const matchJob = filterJobId === 'ALL' || a.jobId === Number(filterJobId);
    const matchStatus = filterStatus === 'ALL' || a.status === filterStatus;
    return matchJob && matchStatus;
  });

  const handlePostJobSubmit = async (e) => {
    e.preventDefault();
    await createJob(jobForm);
    setShowPostJobModal(false);
    setJobForm({
      title: '',
      jobType: 'INTERNSHIP',
      salaryRange: '6.000.000 - 8.000.000 VNĐ / tháng',
      location: 'Hà Nội',
      slots: 2,
      deadline: '2026-11-30',
      description: '',
      requirements: '',
      benefits: '',
      skills: ['Java', 'Spring Boot'],
    });
  };

  const handleOpenEditCompanyJob = (job) => {
    setEditingCompanyJob(job);
    setEditCompanyJobForm({
      title: job.title,
      jobType: job.jobType || 'INTERNSHIP',
      salaryRange: job.salaryRange || '',
      location: job.location || '',
      slots: job.slots || 2,
      deadline: job.deadline || '',
      description: job.description || '',
      requirements: job.requirements || '',
      benefits: job.benefits || '',
      skills: job.skills || [],
    });
  };

  const handleSaveEditCompanyJob = async (e) => {
    e.preventDefault();
    if (!editingCompanyJob) return;
    await updateJob(editingCompanyJob.id, editCompanyJobForm);
    setEditingCompanyJob(null);
  };

  const handleOpenReviewModal = (app) => {
    setSelectedCandidate(app);
    setReviewStatus(app.status);
    setReviewFeedback(app.employerFeedback || '');
    if (app.interviewTime) setInterviewTime(app.interviewTime);
    if (app.interviewLocation) setInterviewLocation(app.interviewLocation);
    if (app.interviewNotes) setInterviewNotes(app.interviewNotes);
  };

  const handleSaveCandidateReview = async (e) => {
    e.preventDefault();
    if (!selectedCandidate) return;

    await updateApplicationStatus(selectedCandidate.id, reviewStatus, reviewFeedback, {
      time: interviewTime,
      location: interviewLocation,
      notes: interviewNotes,
    });

    setSelectedCandidate(null);
  };

  const toggleSkillSelection = (skill) => {
    setJobForm((prev) => {
      const exists = prev.skills.includes(skill);
      return {
        ...prev,
        skills: exists ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill],
      };
    });
  };

  return (
    <div className="company-dashboard container">
      {/* Header */}
      <div className="comp-dash-header">
        <div className="header-info-left">
          <div className="comp-badge-avatar">
            <Building2 size={24} />
          </div>
          <div>
            <h1>Quản Trị Tuyển Dụng: {user?.companyProfile?.companyName || user?.fullName || 'Doanh Nghiệp'}</h1>
            <p className="subtitle-text">
              Tiếp nhận hồ sơ, sàng lọc ứng viên và lên lịch phỏng vấn sinh viên UET
            </p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowPostJobModal(true)}>
          <PlusCircle size={18} /> Đăng tin tuyển dụng mới
        </button>
      </div>

      {/* Stats row */}
      <div className="comp-stats-grid">
        <div className="comp-stat-card">
          <div className="stat-icon-wrap blue">
            <Briefcase size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-num">{stats.totalJobs}</span>
            <span className="stat-name">Tin tuyển dụng đang mở</span>
          </div>
        </div>

        <div className="comp-stat-card">
          <div className="stat-icon-wrap purple">
            <Users size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-num">{stats.totalCandidates}</span>
            <span className="stat-name">Tổng hồ sơ ứng tuyển</span>
          </div>
        </div>

        <div className="comp-stat-card">
          <div className="stat-icon-wrap amber">
            <Video size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-num">{stats.interviewing}</span>
            <span className="stat-name">Đang phỏng vấn</span>
          </div>
        </div>

        <div className="comp-stat-card">
          <div className="stat-icon-wrap green">
            <CheckCircle2 size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-num">{stats.accepted}</span>
            <span className="stat-name">Đã nhận thực tập</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="dash-tabs-bar">
        <button
          className={`dash-tab-btn ${activeTab === 'candidates' ? 'active' : ''}`}
          onClick={() => setActiveTab('candidates')}
        >
          <Users size={18} /> Quản lý ứng viên ({companyApplications.length})
        </button>
        <button
          className={`dash-tab-btn ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('jobs')}
        >
          <Briefcase size={18} /> Tin tuyển dụng đã đăng ({companyJobs.length})
        </button>
      </div>

      {/* TAB 1: CANDIDATES MANAGEMENT */}
      {activeTab === 'candidates' && (
        <div className="candidates-management-view">
          {/* Filter Toolbar */}
          <div className="filter-toolbar-card">
            <div className="toolbar-header">
              <div className="toolbar-title">
                <Filter size={18} className="text-primary" />
                <span>Bộ lọc danh sách ứng viên</span>
              </div>
              <span className="toolbar-count">
                Hiển thị <strong>{filteredApplications.length}</strong> / {companyApplications.length} hồ sơ
              </span>
            </div>

            <div className="toolbar-controls-grid">
              <div className="toolbar-field">
                <label className="field-label">
                  <Briefcase size={14} /> Lọc theo vị trí ứng tuyển:
                </label>
                <div className="select-wrapper">
                  <select
                    className="toolbar-select"
                    value={filterJobId}
                    onChange={(e) => setFilterJobId(e.target.value)}
                  >
                    <option value="ALL">Tất cả vị trí tuyển dụng ({companyJobs.length})</option>
                    {companyJobs.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="toolbar-field">
                <label className="field-label">
                  <CheckCircle2 size={14} /> Lọc theo trạng thái hồ sơ:
                </label>
                <div className="select-wrapper">
                  <select
                    className="toolbar-select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="ALL">Tất cả trạng thái hồ sơ</option>
                    <option value="APPLIED">Đã nộp hồ sơ</option>
                    <option value="REVIEWING">Đang xem xét duyệt</option>
                    <option value="INTERVIEW">Mời phỏng vấn</option>
                    <option value="ACCEPTED">Đã tiếp nhận (Trúng tuyển)</option>
                    <option value="REJECTED">Đã từ chối</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          {filteredApplications.length === 0 ? (
            <div className="empty-state-card">
              <Users size={40} className="text-muted" />
              <h4>Chưa có ứng viên nào phù hợp bộ lọc</h4>
              <p>Hồ sơ của sinh viên ứng tuyển sẽ hiển thị tại đây theo thời gian thực.</p>
            </div>
          ) : (
            <div className="table-responsive-card">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th style={{ width: '22%' }}>Ứng viên & Liên hệ</th>
                    <th style={{ width: '20%' }}>Vị trí ứng tuyển</th>
                    <th style={{ width: '18%' }}>Trường & GPA</th>
                    <th style={{ width: '13%' }}>Kỹ năng</th>
                    <th className="text-center" style={{ width: '10%', whiteSpace: 'nowrap' }}>Trạng thái</th>
                    <th className="text-center" style={{ width: '8%', whiteSpace: 'nowrap' }}>Hồ sơ CV</th>
                    <th className="text-center" style={{ width: '9%', whiteSpace: 'nowrap' }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app) => (
                    <tr key={app.id}>
                      <td>
                        <div className="candidate-cell">
                          <strong className="candidate-name">{app.studentName}</strong>
                          <span className="cell-sub"><Mail size={12} /> {app.studentEmail}</span>
                          {app.studentPhone && (
                            <span className="cell-sub"><Phone size={12} /> {app.studentPhone}</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="job-cell-title">{app.jobTitle}</span>
                      </td>
                      <td>
                        <div className="edu-cell">
                          <span className="edu-school">{app.studentUniversity || 'UET - ĐHQGHN'}</span>
                          <span className="gpa-tag">GPA: {app.studentGpa || '3.6+'}</span>
                        </div>
                      </td>
                      <td>
                        <div className="skills-inline-chips">
                          {app.studentSkills && app.studentSkills.slice(0, 3).map((s, idx) => (
                            <span key={idx} className="skill-mini-chip">{s}</span>
                          ))}
                        </div>
                      </td>
                      <td className="text-center">
                        <span className={`status-pill ${app.status?.toLowerCase()}`}>
                          {app.status === 'APPLIED' && 'Đã nộp'}
                          {app.status === 'REVIEWING' && 'Đang duyệt'}
                          {app.status === 'INTERVIEW' && 'Phỏng vấn'}
                          {app.status === 'ACCEPTED' && 'Trúng tuyển'}
                          {app.status === 'REJECTED' && 'Từ chối'}
                        </span>
                      </td>
                      <td className="text-center">
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="cv-btn-link"
                          title="Mở CV xem"
                        >
                          <FileText size={14} /> Xem CV
                        </a>
                      </td>
                      <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                        <button
                          className="btn btn-primary-sm"
                          onClick={() => handleOpenReviewModal(app)}
                          style={{ whiteSpace: 'nowrap' }}
                        >
                          <Edit3 size={14} /> Phê duyệt / Lên lịch
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: JOBS MANAGEMENT */}
      {activeTab === 'jobs' && (
        <div className="jobs-management-view">
          {companyJobs.length === 0 ? (
            <div className="empty-state-card">
              <Briefcase size={40} className="text-muted" />
              <h4>Chưa có tin tuyển dụng nào được đăng</h4>
              <p>Hãy nhấn nút "Đăng tin tuyển dụng mới" ở góc trên để tạo bài đăng đầu tiên.</p>
              <button className="btn btn-primary" onClick={() => setShowPostJobModal(true)}>
                <PlusCircle size={16} /> Đăng tin tuyển dụng ngay
              </button>
            </div>
          ) : (
            <div className="table-responsive-card">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th style={{ width: '32%' }}>Tiêu đề vị trí</th>
                    <th className="text-center" style={{ width: '13%', whiteSpace: 'nowrap' }}>Hình thức</th>
                    <th style={{ width: '18%', whiteSpace: 'nowrap' }}>Trợ cấp / Lương</th>
                    <th className="text-center" style={{ width: '9%', whiteSpace: 'nowrap' }}>Chỉ tiêu</th>
                    <th className="text-center" style={{ width: '12%', whiteSpace: 'nowrap' }}>Lượt ứng tuyển</th>
                    <th className="text-center" style={{ width: '10%', whiteSpace: 'nowrap' }}>Hạn nộp</th>
                    <th className="text-center" style={{ width: '6%', whiteSpace: 'nowrap' }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {companyJobs.map((j) => (
                    <tr key={j.id}>
                      <td>
                        <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                          {j.title}
                        </strong>
                        <div className="skills-inline-chips">
                          {j.skills && j.skills.map((s, idx) => (
                            <span key={idx} className="skill-mini-chip">{s}</span>
                          ))}
                        </div>
                      </td>
                      <td className="text-center">
                        <span className={`meta-badge type ${j.jobType ? j.jobType.toLowerCase() : 'internship'}`} style={{ display: 'inline-flex', padding: '3px 10px', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                          {j.jobType === 'INTERNSHIP' && 'Thực tập sinh'}
                          {j.jobType === 'FULL_TIME' && 'Toàn thời gian'}
                          {j.jobType === 'PART_TIME' && 'Bán thời gian'}
                          {j.jobType === 'REMOTE' && 'Làm từ xa'}
                          {!['INTERNSHIP', 'FULL_TIME', 'PART_TIME', 'REMOTE'].includes(j.jobType) && (j.jobType || 'Thực tập sinh')}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                          {j.salaryRange || 'Thỏa thuận'}
                        </span>
                      </td>
                      <td className="text-center">
                        <span style={{ fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                          {j.slots || 1} bạn
                        </span>
                      </td>
                      <td className="text-center">
                        <span className="badge-count-pill" style={{ background: '#eff6ff', color: '#2563eb', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          {j.applicationsCount || 0} hồ sơ
                        </span>
                      </td>
                      <td className="text-center">
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                          {j.deadline || 'Không thời hạn'}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="action-buttons-group center">
                          <button
                            className="btn btn-outline-sm"
                            onClick={() => handleOpenEditCompanyJob(j)}
                            title="Chỉnh sửa tin này"
                          >
                            <Edit3 size={13} /> Sửa
                          </button>
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
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* MODAL: POST NEW JOB */}
      {showPostJobModal && (
        <div className="modal-overlay" onClick={() => setShowPostJobModal(false)}>
          <div className="modal-content modal-lg animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Đăng tin tuyển dụng thực tập mới</h3>
              <button className="modal-close-btn" onClick={() => setShowPostJobModal(false)}>
                <XCircle size={20} />
              </button>
            </div>
            <form onSubmit={handlePostJobSubmit} className="job-post-form">
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Tiêu đề vị trí tuyển dụng:</label>
                  <input
                    type="text"
                    className="form-input"
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    placeholder="vd: Thực tập sinh Backend Java / Spring Boot"
                    required
                  />
                </div>

                <div className="form-grid-3">
                  <div className="form-group">
                    <label className="form-label">Hình thức:</label>
                    <select
                      className="form-select"
                      value={jobForm.jobType}
                      onChange={(e) => setJobForm({ ...jobForm, jobType: e.target.value })}
                    >
                      <option value="INTERNSHIP">Thực tập sinh (Intern)</option>
                      <option value="FULL_TIME">Toàn thời gian</option>
                      <option value="PART_TIME">Bán thời gian</option>
                      <option value="REMOTE">Làm việc từ xa</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Mức trợ cấp / Lương:</label>
                    <input
                      type="text"
                      className="form-input"
                      value={jobForm.salaryRange}
                      onChange={(e) => setJobForm({ ...jobForm, salaryRange: e.target.value })}
                      placeholder="vd: 6.000.000 - 8.000.000 VNĐ"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Số lượng chỉ tiêu:</label>
                    <input
                      type="number"
                      min="1"
                      className="form-input"
                      value={jobForm.slots}
                      onChange={(e) => setJobForm({ ...jobForm, slots: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Địa điểm làm việc:</label>
                    <input
                      type="text"
                      className="form-input"
                      value={jobForm.location}
                      onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                      placeholder="vd: Cầu Giấy, Hà Nội"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Hạn nộp hồ sơ:</label>
                    <input
                      type="date"
                      className="form-input"
                      value={jobForm.deadline}
                      onChange={(e) => setJobForm({ ...jobForm, deadline: e.target.value })}
                    />
                  </div>
                </div>

                {/* Skills tags selector */}
                <div className="form-group">
                  <label className="form-label">Kỹ năng yêu cầu:</label>
                  <div className="skills-selectable-grid">
                    {INITIAL_SKILLS.map((sk) => {
                      const selected = jobForm.skills.includes(sk);
                      return (
                        <button
                          key={sk}
                          type="button"
                          className={`skill-select-chip ${selected ? 'active' : ''}`}
                          onClick={() => toggleSkillSelection(sk)}
                        >
                          {sk}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Mô tả công việc & Dự án:</label>
                  <textarea
                    rows={4}
                    className="form-textarea"
                    value={jobForm.description}
                    onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                    placeholder="Mô tả công việc chi tiết, mentor kèm cặp..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Yêu cầu ứng viên:</label>
                  <textarea
                    rows={4}
                    className="form-textarea"
                    value={jobForm.requirements}
                    onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                    placeholder="Kiến thức Java core, OOP, tinh thần học hỏi..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Quyền lợi & Đãi ngộ:</label>
                  <textarea
                    rows={3}
                    className="form-textarea"
                    value={jobForm.benefits}
                    onChange={(e) => setJobForm({ ...jobForm, benefits: e.target.value })}
                    placeholder="Cơ hội lên chính thức, dấu mộc thực tập, teambuilding..."
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPostJobModal(false)}>
                  Hủy bỏ
                </button>
                <button type="submit" className="btn btn-primary">
                  <Send size={15} /> Xuất bản tin tuyển dụng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REVIEW CANDIDATE & SCHEDULE INTERVIEW */}
      {selectedCandidate && (
        <div className="modal-overlay" onClick={() => setSelectedCandidate(null)}>
          <div className="modal-content modal-md animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Phê duyệt ứng viên: {selectedCandidate.studentName}</h3>
                <p className="modal-subtitle">Ứng tuyển: {selectedCandidate.jobTitle}</p>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedCandidate(null)}>
                <XCircle size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCandidateReview}>
              <div className="modal-body">
                {/* Student Info Box */}
                <div className="candidate-info-highlight">
                  <p><strong>Email:</strong> {selectedCandidate.studentEmail} • <strong>SĐT:</strong> {selectedCandidate.studentPhone}</p>
                  <p><strong>Trường:</strong> {selectedCandidate.studentUniversity} • <strong>GPA:</strong> {selectedCandidate.studentGpa}</p>
                  <div className="cover-letter-preview">
                    <span className="preview-label">Thư giới thiệu:</span>
                    <p>{selectedCandidate.coverLetter || 'Không có thư.'}</p>
                  </div>
                  <a
                    href={selectedCandidate.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="link-primary"
                  >
                    <ExternalLink size={14} /> Xem CV / Portfolio của ứng viên
                  </a>
                </div>

                {/* Status Selection */}
                <div className="form-group">
                  <label className="form-label">Cập nhật trạng thái:</label>
                  <select
                    className="form-select"
                    value={reviewStatus}
                    onChange={(e) => setReviewStatus(e.target.value)}
                  >
                    <option value="APPLIED">1. Đã tiếp nhận hồ sơ</option>
                    <option value="REVIEWING">2. Đang xem xét hồ sơ kỹ thuật</option>
                    <option value="INTERVIEW">3. Mời tham gia phỏng vấn</option>
                    <option value="ACCEPTED">4. Đồng ý tiếp nhận thực tập (Trúng tuyển)</option>
                    <option value="REJECTED">5. Từ chối hồ sơ</option>
                  </select>
                </div>

                {/* Interview scheduling fields if status is INTERVIEW */}
                {reviewStatus === 'INTERVIEW' && (
                  <div className="interview-schedule-fields animate-fade-in">
                    <div className="form-group">
                      <label className="form-label">
                        <Calendar size={15} /> Thời gian phỏng vấn:
                      </label>
                      <input
                        type="datetime-local"
                        className="form-input"
                        value={interviewTime}
                        onChange={(e) => setInterviewTime(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <Video size={15} /> Link Google Meet / Địa điểm:
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        value={interviewLocation}
                        onChange={(e) => setInterviewLocation(e.target.value)}
                        placeholder="https://meet.google.com/..."
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Ghi chú phỏng vấn (cho ứng viên):</label>
                      <input
                        type="text"
                        className="form-input"
                        value={interviewNotes}
                        onChange={(e) => setInterviewNotes(e.target.value)}
                        placeholder="Yêu cầu chuẩn bị slide hoặc demo đồ án..."
                      />
                    </div>
                  </div>
                )}

                {/* Employer Feedback */}
                <div className="form-group">
                  <label className="form-label">Phản hồi / Nhận xét của nhà tuyển dụng:</label>
                  <textarea
                    rows={3}
                    className="form-textarea"
                    value={reviewFeedback}
                    onChange={(e) => setReviewFeedback(e.target.value)}
                    placeholder="Nhập nhận xét hoặc kết quả đánh giá năng lực..."
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedCandidate(null)}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle2 size={16} /> Lưu trạng thái & Gửi thông báo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT COMPANY JOB */}
      {editingCompanyJob && (
        <div className="modal-overlay" onClick={() => setEditingCompanyJob(null)}>
          <div className="modal-content modal-lg animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                <Edit3 size={20} className="text-primary" /> Chỉnh sửa tin tuyển dụng
              </h3>
              <button className="modal-close-btn" onClick={() => setEditingCompanyJob(null)}>
                <XCircle size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveEditCompanyJob} className="job-post-form">
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Tiêu đề vị trí tuyển dụng:</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editCompanyJobForm.title}
                    onChange={(e) => setEditCompanyJobForm({ ...editCompanyJobForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-grid-3">
                  <div className="form-group">
                    <label className="form-label">Hình thức:</label>
                    <select
                      className="form-select"
                      value={editCompanyJobForm.jobType}
                      onChange={(e) => setEditCompanyJobForm({ ...editCompanyJobForm, jobType: e.target.value })}
                    >
                      <option value="INTERNSHIP">Thực tập sinh (Intern)</option>
                      <option value="FULL_TIME">Toàn thời gian</option>
                      <option value="PART_TIME">Bán thời gian</option>
                      <option value="REMOTE">Làm việc từ xa</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Mức trợ cấp / Lương:</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editCompanyJobForm.salaryRange}
                      onChange={(e) => setEditCompanyJobForm({ ...editCompanyJobForm, salaryRange: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Số lượng chỉ tiêu:</label>
                    <input
                      type="number"
                      min="1"
                      className="form-input"
                      value={editCompanyJobForm.slots}
                      onChange={(e) => setEditCompanyJobForm({ ...editCompanyJobForm, slots: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Địa điểm làm việc:</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editCompanyJobForm.location}
                      onChange={(e) => setEditCompanyJobForm({ ...editCompanyJobForm, location: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Hạn nộp hồ sơ:</label>
                    <input
                      type="date"
                      className="form-input"
                      value={editCompanyJobForm.deadline}
                      onChange={(e) => setEditCompanyJobForm({ ...editCompanyJobForm, deadline: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Kỹ năng yêu cầu:</label>
                  <div className="skills-selectable-grid">
                    {INITIAL_SKILLS.map((sk) => {
                      const selected = editCompanyJobForm.skills.includes(sk);
                      return (
                        <button
                          key={sk}
                          type="button"
                          className={`skill-select-chip ${selected ? 'active' : ''}`}
                          onClick={() => {
                            setEditCompanyJobForm((prev) => ({
                              ...prev,
                              skills: prev.skills.includes(sk) ? prev.skills.filter((s) => s !== sk) : [...prev.skills, sk],
                            }));
                          }}
                        >
                          {sk}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Mô tả công việc & Dự án:</label>
                  <textarea
                    rows={4}
                    className="form-textarea"
                    value={editCompanyJobForm.description}
                    onChange={(e) => setEditCompanyJobForm({ ...editCompanyJobForm, description: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Yêu cầu ứng viên:</label>
                  <textarea
                    rows={4}
                    className="form-textarea"
                    value={editCompanyJobForm.requirements}
                    onChange={(e) => setEditCompanyJobForm({ ...editCompanyJobForm, requirements: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Quyền lợi & Đãi ngộ:</label>
                  <textarea
                    rows={3}
                    className="form-textarea"
                    value={editCompanyJobForm.benefits}
                    onChange={(e) => setEditCompanyJobForm({ ...editCompanyJobForm, benefits: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingCompanyJob(null)}>
                  Hủy bỏ
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle2 size={16} /> Lưu cập nhật tin tuyển dụng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
