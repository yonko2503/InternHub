import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Building2, MapPin, Globe, Users, Briefcase, ExternalLink, ShieldCheck } from 'lucide-react';

export default function CompaniesPage({ onSelectCompanyJobs }) {
  const { allUsers, jobs } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const companies = allUsers
    .filter((u) => u.role === 'ROLE_COMPANY' && u.companyProfile)
    .map((u) => ({
      ...u.companyProfile,
      userId: u.id,
      email: u.email,
      phone: u.phone,
      openJobsCount: jobs.filter((j) => j.companyId === u.companyProfile?.id || j.companyName === u.companyProfile?.companyName).length,
    }));

  const filtered = companies.filter((c) =>
    c.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="companies-page container">
      <div className="page-header-box">
        <div>
          <h1 className="page-title">
            <Building2 size={28} className="text-primary" /> Mạng Lưới Doanh Nghiệp Đối Tác
          </h1>
          <p className="page-subtitle">
            Hơn 120+ tập đoàn công nghệ & doanh nghiệp liên kết đào tạo cùng Đại học Công nghệ (UET)
          </p>
        </div>
      </div>

      {/* Search company */}
      <div className="search-filter-card">
        <div className="search-input-wrap">
          <Building2 size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm công ty theo tên, lĩnh vực hoặc địa chỉ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Companies Grid */}
      <div className="companies-grid">
        {filtered.map((comp) => (
          <div key={comp.id || comp.userId} className="company-directory-card">
            <div className="comp-card-top">
              <img
                src={comp.logoUrl || '/logos/default-company.svg'}
                alt={comp.companyName}
                className="comp-logo-large"
                onError={(e) => { e.currentTarget.src = '/logos/default-company.svg'; }}
              />
              <div className="comp-top-text">
                <div className="comp-title-row">
                  <h3 className="comp-name">{comp.companyName}</h3>
                  {comp.isVerified && (
                    <span className="verified-tag" title="Doanh nghiệp đối tác chính thức">
                      <ShieldCheck size={14} /> Đối tác UET
                    </span>
                  )}
                </div>
                <p className="comp-industry">{comp.industry || 'Công nghệ thông tin'}</p>
              </div>
            </div>

            <p className="comp-description">
              {comp.description || 'Đối tác đào tạo thực tập doanh nghiệp cùng khoa CNTT - Đại học Công nghệ.'}
            </p>

            <div className="comp-meta-list">
              <div className="comp-meta-item">
                <MapPin size={14} /> <span>{comp.address || 'Hà Nội'}</span>
              </div>
              <div className="comp-meta-item">
                <Users size={14} /> <span>Quy mô: {comp.scale || '100+ nhân sự'}</span>
              </div>
              {comp.website && (
                <div className="comp-meta-item">
                  <Globe size={14} />
                  <a href={comp.website} target="_blank" rel="noreferrer" className="website-link">
                    {comp.website.replace('https://', '')} <ExternalLink size={12} />
                  </a>
                </div>
              )}
            </div>

            <div className="comp-card-footer">
              <span className="open-jobs-badge">
                <Briefcase size={14} /> <strong>{comp.openJobsCount}</strong> vị trí đang tuyển
              </span>
              <button
                className="btn btn-primary-sm"
                onClick={() => onSelectCompanyJobs(comp.companyName)}
              >
                Xem tuyển dụng
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
