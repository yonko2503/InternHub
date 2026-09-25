import React from 'react';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Users, 
  ArrowRight, 
  CheckCircle2,
  Clock
} from 'lucide-react';
import { getCompanyLogoUrl } from '../api/mockData';
import { useAuth } from '../context/AuthContext';

export default function JobCard({ job, onSelect, onApply, isApplied }) {
  const { allUsers } = useAuth() || {};

  const cName = (job.companyName || job.title || '').toLowerCase().trim();

  // Dynamically resolve the latest company avatar from active users state
  const compUser = allUsers?.find((u) => {
    if (u.role !== 'ROLE_COMPANY') return false;
    const uComp = (u.companyProfile?.companyName || '').toLowerCase().trim();
    const uFull = (u.fullName || '').toLowerCase().trim();
    const uUser = (u.username || '').toLowerCase().trim();

    // 1. Strict Brand matching first (prevents ID collision across cached items)
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
    <div className="job-card">
      <div className="job-card-header">
        <img
          src={logo}
          alt={job.companyName}
          className="company-avatar"
          onError={(e) => { e.currentTarget.src = '/logos/default-company.svg'; }}
        />
        <div className="job-header-text">
          <h3 className="job-title" onClick={() => onSelect(job)}>
            {job.title}
          </h3>
          <p className="company-name">
            <Building2 size={14} /> {job.companyName}
          </p>
        </div>
      </div>

      <div className="job-meta-row">
        <span className="meta-badge salary">
          <DollarSign size={14} /> {job.salaryRange || 'Thỏa thuận'}
        </span>
        <span className="meta-badge location">
          <MapPin size={14} /> {job.location || 'Hà Nội'}
        </span>
        <span className={`meta-badge type ${job.jobType?.toLowerCase()}`}>
          {job.jobType === 'INTERNSHIP' && 'Thực tập sinh'}
          {job.jobType === 'FULL_TIME' && 'Toàn thời gian'}
          {job.jobType === 'PART_TIME' && 'Bán thời gian'}
          {job.jobType === 'REMOTE' && 'Làm từ xa (Remote)'}
        </span>
      </div>

      <p className="job-desc-snippet">
        {job.description?.length > 120 ? job.description.substring(0, 120) + '...' : job.description}
      </p>

      {/* Skills tags */}
      <div className="job-skills-row">
        {job.skills && job.skills.map((skill, idx) => (
          <span key={idx} className="skill-tag">
            {skill}
          </span>
        ))}
      </div>

      <div className="job-card-footer">
        <div className="footer-left-info">
          <span className="info-text">
            <Users size={13} /> Tuyển: <strong>{job.slots || 1}</strong> bạn
          </span>
          <span className="info-text">
            <Clock size={13} /> Hạn nộp: {job.deadline ? new Date(job.deadline).toLocaleDateString('vi-VN') : 'Đang mở'}
          </span>
        </div>

        <div className="footer-actions">
          <button className="btn btn-outline-sm" onClick={() => onSelect(job)}>
            Chi tiết
          </button>
          {isApplied ? (
            <button className="btn btn-applied-sm" disabled>
              <CheckCircle2 size={14} /> Đã ứng tuyển
            </button>
          ) : (
            <button className="btn btn-primary-sm" onClick={() => onApply(job)}>
              Ứng tuyển <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
