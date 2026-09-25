import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Building2, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  GraduationCap,
  Award,
  TrendingUp,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import JobCard from '../components/JobCard';
import { useAuth } from '../context/AuthContext';
import { getCompanyLogoUrl } from '../api/mockData';

export default function HomePage({ onNavigate, onSelectJob, onApplyJob }) {
  const { jobs = [], applications = [], user, allUsers = [] } = useAuth();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('all');

  const filteredJobs = jobs.filter((job) => {
    const matchKeyword = !keyword || 
      job.title.toLowerCase().includes(keyword.toLowerCase()) ||
      job.companyName.toLowerCase().includes(keyword.toLowerCase()) ||
      job.skills?.some((s) => s.toLowerCase().includes(keyword.toLowerCase()));
    
    const matchLocation = location === 'all' || job.location?.toLowerCase().includes(location.toLowerCase());
    return matchKeyword && matchLocation;
  });

  const appliedJobIds = new Set(
    applications
      .filter((a) => a.studentUserId === user?.id)
      .map((a) => a.jobId)
  );

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="container hero-content">
          <div className="hero-badge">
            <GraduationCap size={16} /> Cổng thông tin Thực tập Doanh nghiệp UET
          </div>
          <h1 className="hero-title">
            Khởi Đầu Sự Nghiệp Công Nghệ Tại <span className="gradient-text">InternHub</span>
          </h1>
          <p className="hero-subtitle">
            Kết nối sinh viên tài năng Đại học Công nghệ (UET - ĐHQGHN) với hơn 100+ tập đoàn công nghệ & doanh nghiệp hàng đầu. Tìm kiếm vị trí thực tập phù hợp ngay hôm nay!
          </p>

          {/* Quick Search Box */}
          <div className="hero-search-box">
            <div className="search-input-group">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Vị trí, công nghệ (Java, React, AI, Python)..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onNavigate('jobs')}
              />
            </div>

            <div className="search-divider" />

            <div className="search-select-group">
              <MapPin size={20} className="search-icon" />
              <select
                className="search-select"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="all">Tất cả địa điểm</option>
                <option value="Hà Nội">Hà Nội</option>
                <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                <option value="Hybrid">Hybrid / Linh hoạt</option>
              </select>
            </div>

            <button
              className="btn btn-search"
              onClick={() => onNavigate('jobs')}
            >
              Tìm việc ngay
            </button>
          </div>

          {/* Hero Counter Stats */}
          <div className="hero-stats-row">
            <div className="hero-stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-desc">Sinh viên UET tham gia</span>
            </div>
            <div className="hero-stat-item">
              <span className="stat-number">120+</span>
              <span className="stat-desc">Doanh nghiệp đối tác</span>
            </div>
            <div className="hero-stat-item">
              <span className="stat-number">350+</span>
              <span className="stat-desc">Cơ hội thực tập mở</span>
            </div>
            <div className="hero-stat-item">
              <span className="stat-number">95%</span>
              <span className="stat-desc">Tỷ lệ có việc sau thực tập</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED JOBS SECTION */}
      <section className="featured-jobs-section container">
        <div className="section-header-flex">
          <div>
            <h2 className="section-heading">
              <Sparkles size={24} className="text-warning" /> Vị Trí Thực Tập Nổi Bật Mới Nhất
            </h2>
            <p className="section-subheading">
              Các công việc thực tập được các doanh nghiệp uy tín đăng tuyển gần đây
            </p>
          </div>
          <button className="btn btn-outline" onClick={() => onNavigate('jobs')}>
            Xem tất cả {jobs.length} việc làm <ArrowRight size={16} />
          </button>
        </div>

        <div className="jobs-grid">
          {filteredJobs.slice(0, 4).map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onSelect={onSelectJob}
              onApply={onApplyJob}
              isApplied={appliedJobIds.has(job.id)}
            />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS / ROADMAP */}
      <section className="workflow-section">
        <div className="container">
          <div className="text-center-head">
            <h2 className="section-heading">Quy Trình Thực Tập Chuẩn Doanh Nghiệp</h2>
            <p className="section-subheading">4 bước đơn giản để hoàn thành học phần thực hành doanh nghiệp UET</p>
          </div>

          <div className="workflow-grid">
            <div className="step-card">
              <div className="step-num">01</div>
              <div className="step-icon-circle">
                <Search size={24} />
              </div>
              <h3>Tìm kiếm & Chọn lọc</h3>
              <p>Khám phá hàng trăm tin tuyển dụng từ các tập đoàn công nghệ lớn, lọc theo kỹ năng chuyên môn.</p>
            </div>

            <div className="step-card">
              <div className="step-num">02</div>
              <div className="step-icon-circle">
                <SendHorizontal size={24} />
              </div>
              <h3>Nộp hồ sơ 1 chạm</h3>
              <p>Gửi trực tiếp CV trực tuyến và Cover Letter tới bộ phận tuyển dụng chỉ với 1 cú click chuột.</p>
            </div>

            <div className="step-card">
              <div className="step-num">03</div>
              <div className="step-icon-circle">
                <Calendar size={24} />
              </div>
              <h3>Phỏng vấn trực tiếp</h3>
              <p>Nhận lịch hẹn, phòng họp online và phản hồi kết quả trực tiếp từ nhà tuyển dụng trên hệ thống.</p>
            </div>

            <div className="step-card">
              <div className="step-num">04</div>
              <div className="step-icon-circle">
                <Award size={24} />
              </div>
              <h3>Thực tập & Báo cáo</h3>
              <p>Nhận xác nhận mộc tròn doanh nghiệp và hoàn thành điểm học phần thực tập xuất sắc.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNER COMPANIES SECTION */}
      <section className="partners-section container">
        <div className="text-center-head">
          <h2 className="section-heading">Doanh Nghiệp Tiêu Biểu Tuyển Dụng Tại UET</h2>
          <p className="section-subheading">Các đối tác chiến lược hàng năm của Trường Đại học Công nghệ</p>
        </div>

        <div className="partners-grid">
          {allUsers
            .filter((u) => u.role === 'ROLE_COMPANY' && u.companyProfile)
            .map((u) => {
              const comp = u.companyProfile;
              const openJobsCount = jobs.filter(
                (j) => j.companyId === comp.id || j.companyName === comp.companyName
              ).length;
              const logo = getCompanyLogoUrl(comp.companyName, comp.logoUrl || u.avatar);

              return (
                <div key={u.id} className="partner-card" onClick={() => onNavigate('companies')}>
                  <div className="partner-logo-wrapper">
                    <img
                      src={logo}
                      alt={comp.companyName}
                      className="partner-logo"
                      onError={(e) => { e.currentTarget.src = '/logos/default-company.svg'; }}
                    />
                  </div>
                  <h4 className="partner-name">{comp.companyName}</h4>
                  <span className="partner-jobs-count">
                    {openJobsCount > 0 ? `${openJobsCount} vị trí đang mở` : 'Đối tác Vàng UET'}
                  </span>
                </div>
              );
            })}
        </div>
      </section>
    </div>
  );
}

function SendHorizontal(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 3 3 9-3 9 19-9Z" />
      <path d="M6 12h16" />
    </svg>
  );
}
