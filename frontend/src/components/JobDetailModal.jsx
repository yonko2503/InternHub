import React from 'react';
import { 
  X, 
  Building2, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Users, 
  Globe, 
  CheckCircle, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { getCompanyLogoUrl } from '../api/mockData';
import { useAuth } from '../context/AuthContext';

export default function JobDetailModal({ job, onClose, onApply, isApplied, isStudent }) {
  const { allUsers } = useAuth() || {};

  if (!job) return null;

  const cName = (job.companyName || job.title || '').toLowerCase().trim();

  const compUser = allUsers?.find((u) => {
    if (u.role !== 'ROLE_COMPANY') return false;
    const uComp = (u.companyProfile?.companyName || '').toLowerCase().trim();
    const uFull = (u.fullName || '').toLowerCase().trim();
    const uUser = (u.username || '').toLowerCase().trim();

    // 1. Strict Brand matching first
    if (cName.includes('viettel')) return uUser.includes('viettel') || uComp.includes('viettel') || uFull.includes('viettel');
    if (cName.includes('fpt')) return uUser.includes('fpt') || uComp.includes('fpt') || uFull.includes('fpt');
    if (cName.includes('techcorp')) return uUser.includes('techcorp') || uComp.includes('techcorp') || uFull.includes('techcorp');
    if (cName.includes('vng')) return uUser.includes('vng') || uComp.includes('vng') || uFull.includes('vng');

    // 2. Exact or substring name match
    if (uComp && (cName === uComp || cName.includes(uComp) || uComp.includes(cName))) return true;
    if (uFull && (cName === uFull || cName.includes(uFull) || uFull.includes(cName))) return true;
    if (job.companyId && u.id === job.companyId) return true;
    return false;
  });

  const latestLogo = compUser?.avatar || compUser?.companyProfile?.logoUrl || job.companyLogo;
  const logo = getCompanyLogoUrl(job.companyName || job.title, latestLogo);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg animate-fade-in" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="header-company-info">
            <img
              src={logo}
              alt={job.companyName}
              className="modal-company-logo"
              onError={(e) => { e.currentTarget.src = '/logos/default-company.svg'; }}
            />
            <div>
              <h2 className="modal-job-title">{job.title}</h2>
              <div className="company-meta-line">
                <span className="company-name-bold">{job.companyName}</span>
                {job.companyWebsite && (
                  <a
                    href={job.companyWebsite}
                    target="_blank"
                    rel="noreferrer"
                    className="company-website-link"
                  >
                    <Globe size={13} /> Trang chủ
                  </a>
                )}
                <span className="verified-badge">
                  <ShieldCheck size={13} /> Doanh nghiệp đối tác UET
                </span>
              </div>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Quick Overview Badges */}
          <div className="job-quick-stats-grid">
            <div className="stat-card">
              <span className="stat-label">Mức lương / Trợ cấp</span>
              <span className="stat-value text-accent">
                <DollarSign size={16} /> {job.salaryRange || 'Thỏa thuận'}
              </span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Địa điểm làm việc</span>
              <span className="stat-value">
                <MapPin size={16} /> {job.location || 'Hà Nội'}
              </span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Chỉ tiêu tuyển dụng</span>
              <span className="stat-value">
                <Users size={16} /> {job.slots || 1} ứng viên
              </span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Hạn nộp hồ sơ</span>
              <span className="stat-value text-warning">
                <Calendar size={16} /> {job.deadline ? new Date(job.deadline).toLocaleDateString('vi-VN') : 'Mở liên tục'}
              </span>
            </div>
          </div>

          {/* Required Skills */}
          <div className="section-block">
            <h4 className="section-title">Kỹ năng chuyên môn yêu cầu</h4>
            <div className="skills-badge-list">
              {job.skills && job.skills.map((s, i) => (
                <span key={i} className="skill-badge-lg">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="section-block">
            <h4 className="section-title">Mô tả công việc & Dự án tham gia</h4>
            <div className="rich-text-content">
              {job.description?.split('\n').map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div className="section-block">
            <h4 className="section-title">Yêu cầu đối với ứng viên</h4>
            <div className="rich-text-content">
              {job.requirements?.split('\n').map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>

          {/* Benefits */}
          {job.benefits && (
            <div className="section-block">
              <h4 className="section-title">Quyền lợi & Chế độ đãi ngộ</h4>
              <div className="rich-text-content">
                {job.benefits.split('\n').map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </div>
          )}

          {/* Company address */}
          {job.companyAddress && (
            <div className="section-block">
              <h4 className="section-title">Địa chỉ văn phòng công ty</h4>
              <p className="address-text">
                <MapPin size={15} /> {job.companyAddress}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Đóng
          </button>
          {isApplied ? (
            <button className="btn btn-applied" disabled>
              <CheckCircle size={16} /> Bạn đã nộp đơn cho vị trí này
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => {
                onClose();
                onApply(job);
              }}
            >
              <Sparkles size={16} /> Ứng tuyển ngay bây giờ
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
