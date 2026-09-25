import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  Video, 
  XCircle, 
  Calendar, 
  Building2, 
  ExternalLink,
  Sparkles,
  MapPin,
  ChevronRight,
  User,
  GraduationCap
} from 'lucide-react';
import JobCard from '../components/JobCard';

export default function StudentDashboard({ onSelectJob, onApplyJob, onNavigate }) {
  const { user, applications, jobs } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState('all');
  const [selectedAppDetail, setSelectedAppDetail] = useState(null);

  const myApplications = applications.filter((a) => a.studentUserId === user?.id || a.studentEmail === user?.email);

  const stats = {
    applied: myApplications.filter((a) => a.status === 'APPLIED').length,
    reviewing: myApplications.filter((a) => a.status === 'REVIEWING').length,
    interview: myApplications.filter((a) => a.status === 'INTERVIEW').length,
    accepted: myApplications.filter((a) => a.status === 'ACCEPTED').length,
    rejected: myApplications.filter((a) => a.status === 'REJECTED').length,
  };

  const filteredApps = myApplications.filter((a) => {
    if (activeSubTab === 'all') return true;
    return a.status === activeSubTab;
  });

  // Recommended jobs based on student's skills
  const studentSkills = user?.studentProfile?.skills || ['Java', 'Spring Boot'];
  const recommendedJobs = jobs.filter((job) =>
    job.skills?.some((s) => studentSkills.includes(s))
  ).slice(0, 3);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPLIED':
        return <span className="status-badge applied"><Clock size={13} /> Đã nộp hồ sơ</span>;
      case 'REVIEWING':
        return <span className="status-badge reviewing"><Clock size={13} /> Đang xem xét</span>;
      case 'INTERVIEW':
        return <span className="status-badge interview"><Video size={13} /> Mời phỏng vấn</span>;
      case 'ACCEPTED':
        return <span className="status-badge accepted"><CheckCircle2 size={13} /> Trúng tuyển thực tập</span>;
      case 'REJECTED':
        return <span className="status-badge rejected"><XCircle size={13} /> Chưa phù hợp</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  return (
    <div className="dashboard-container container">
      {/* Student Welcome Banner */}
      <div className="dashboard-welcome-card">
        <div className="welcome-left">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80'}
            alt={user?.fullName}
            className="welcome-avatar"
          />
          <div>
            <h2>Xin chào, {user?.fullName || 'Sinh viên UET'}! 🎓</h2>
            <p className="welcome-sub">
              {user?.studentProfile?.university || 'Trường Đại học Công nghệ (UET) - ĐHQGHN'} • Khoa CNTT • GPA: <strong>{user?.studentProfile?.gpa || '3.68'}</strong>
            </p>
          </div>
        </div>
        <button className="btn btn-outline" onClick={() => onNavigate('profile')}>
          <User size={16} /> Chỉnh sửa hồ sơ / CV
        </button>
      </div>

      {/* Application Status Pipeline Stats */}
      <div className="status-pipeline-grid">
        <div
          className={`pipeline-card ${activeSubTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('all')}
        >
          <span className="pipeline-title">Tổng đơn ứng tuyển</span>
          <span className="pipeline-count">{myApplications.length}</span>
        </div>

        <div
          className={`pipeline-card applied ${activeSubTab === 'APPLIED' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('APPLIED')}
        >
          <span className="pipeline-title">Đã nộp hồ sơ</span>
          <span className="pipeline-count">{stats.applied}</span>
        </div>

        <div
          className={`pipeline-card reviewing ${activeSubTab === 'REVIEWING' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('REVIEWING')}
        >
          <span className="pipeline-title">Đang duyệt</span>
          <span className="pipeline-count">{stats.reviewing}</span>
        </div>

        <div
          className={`pipeline-card interview ${activeSubTab === 'INTERVIEW' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('INTERVIEW')}
        >
          <span className="pipeline-title">Mời phỏng vấn</span>
          <span className="pipeline-count highlight-green">{stats.interview}</span>
        </div>

        <div
          className={`pipeline-card accepted ${activeSubTab === 'ACCEPTED' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('ACCEPTED')}
        >
          <span className="pipeline-title">Trúng tuyển</span>
          <span className="pipeline-count highlight-gold">{stats.accepted}</span>
        </div>
      </div>

      {/* Main Content Grid: Applications List + Recommended */}
      <div className="dashboard-two-col">
        {/* Left Col: Applications Table/Cards */}
        <div className="dash-col-main">
          <div className="section-header-row">
            <h3 className="section-title">
              <FileText size={20} className="text-primary" /> Tiến Độ Các Vị Trí Đã Ứng Tuyển
            </h3>
            <span className="count-tag">{filteredApps.length} vị trí</span>
          </div>

          {filteredApps.length === 0 ? (
            <div className="empty-state-card">
              <FileText size={40} className="text-muted" />
              <h4>Chưa có đơn ứng tuyển nào trong mục này</h4>
              <p>Hãy khám phá các cơ hội thực tập mới và nộp đơn ngay!</p>
              <button className="btn btn-primary" onClick={() => onNavigate('jobs')}>
                Tìm việc thực tập
              </button>
            </div>
          ) : (
            <div className="apps-list">
              {filteredApps.map((app) => (
                <div key={app.id} className="app-item-card">
                  <div className="app-item-header">
                    <img
                      src={app.companyLogo || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=80&h=80&q=80'}
                      alt={app.companyName}
                      className="app-comp-logo"
                    />
                    <div className="app-header-meta">
                      <h4 className="app-job-title">{app.jobTitle}</h4>
                      <p className="app-comp-name">
                        <Building2 size={13} /> {app.companyName}
                      </p>
                    </div>
                    <div className="app-status-badge-wrap">
                      {getStatusBadge(app.status)}
                    </div>
                  </div>

                  {/* Interview Information Banner if invited */}
                  {app.status === 'INTERVIEW' && (
                    <div className="interview-alert-box animate-pulse-border">
                      <div className="interview-box-header">
                        <Video size={16} className="text-accent" />
                        <strong>Lịch phỏng vấn đã được sắp xếp!</strong>
                      </div>
                      {app.interviewTime && (
                        <p className="interview-time">
                          <Calendar size={14} /> Thời gian: {new Date(app.interviewTime).toLocaleString('vi-VN')}
                        </p>
                      )}
                      {app.interviewLocation && (
                        <p className="interview-link">
                          <MapPin size={14} /> Địa điểm / Link: <strong>{app.interviewLocation}</strong>
                        </p>
                      )}
                      {app.interviewNotes && (
                        <p className="interview-notes">
                          💡 Hướng dẫn từ Mentor: {app.interviewNotes}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Employer Feedback */}
                  {app.employerFeedback && (
                    <div className="feedback-box">
                      <span className="feedback-label">Nhận xét từ nhà tuyển dụng:</span>
                      <p className="feedback-text">"{app.employerFeedback}"</p>
                    </div>
                  )}

                  <div className="app-card-footer">
                    <span className="app-date">
                      Ngày nộp: {new Date(app.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                    <button
                      className="btn btn-outline-sm"
                      onClick={() => setSelectedAppDetail(app)}
                    >
                      Xem chi tiết đơn đã gửi
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Recommended Jobs */}
        <div className="dash-col-side">
          <div className="side-card">
            <h4 className="side-card-title">
              <Sparkles size={18} className="text-warning" /> Gợi Ý Việc Làm Phù Hợp Kỹ Năng
            </h4>
            <div className="side-skills-chips">
              {studentSkills.map((s, idx) => (
                <span key={idx} className="skill-chip-sm">{s}</span>
              ))}
            </div>

            <div className="side-jobs-list">
              {recommendedJobs.map((j) => (
                <div key={j.id} className="side-job-item" onClick={() => onSelectJob(j)}>
                  <div className="side-job-top">
                    <h5>{j.title}</h5>
                    <ChevronRight size={16} className="text-muted" />
                  </div>
                  <p className="side-comp-name">{j.companyName}</p>
                  <span className="side-salary">{j.salaryRange}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal for Application */}
      {selectedAppDetail && (
        <div className="modal-overlay" onClick={() => setSelectedAppDetail(null)}>
          <div className="modal-content modal-md" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Chi tiết đơn ứng tuyển #{selectedAppDetail.id}</h3>
              <button className="modal-close-btn" onClick={() => setSelectedAppDetail(null)}>
                <XCircle size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">Vị trí:</span>
                <strong>{selectedAppDetail.jobTitle}</strong>
              </div>
              <div className="detail-row">
                <span className="detail-label">Doanh nghiệp:</span>
                <span>{selectedAppDetail.companyName}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Trạng thái:</span>
                <div>{getStatusBadge(selectedAppDetail.status)}</div>
              </div>
              <div className="detail-row">
                <span className="detail-label">CV đính kèm:</span>
                <a
                  href={selectedAppDetail.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="link-primary"
                >
                  <ExternalLink size={14} /> Xem CV online
                </a>
              </div>
              <div className="section-block">
                <h4 className="section-title">Thư giới thiệu (Cover Letter)</h4>
                <div className="rich-text-box">
                  {selectedAppDetail.coverLetter || 'Không có thư giới thiệu.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
