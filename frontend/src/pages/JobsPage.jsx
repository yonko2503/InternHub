import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import JobCard from '../components/JobCard';
import { Search, MapPin, Filter, Briefcase, Sparkles, RefreshCw } from 'lucide-react';
import { INITIAL_SKILLS } from '../api/mockData';

export default function JobsPage({ onSelectJob, onApplyJob }) {
  const { jobs, applications, user } = useAuth();
  const [keyword, setKeyword] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [selectedSkill, setSelectedSkill] = useState('ALL');

  const appliedJobIds = useMemo(() => {
    return new Set(
      applications
        .filter((a) => a.studentUserId === user?.id)
        .map((a) => a.jobId)
    );
  }, [applications, user]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchKeyword = !keyword ||
        job.title.toLowerCase().includes(keyword.toLowerCase()) ||
        job.companyName.toLowerCase().includes(keyword.toLowerCase()) ||
        job.description?.toLowerCase().includes(keyword.toLowerCase());

      const matchType = selectedType === 'ALL' || job.jobType === selectedType;
      const matchLocation = selectedLocation === 'ALL' || job.location?.toLowerCase().includes(selectedLocation.toLowerCase());
      const matchSkill = selectedSkill === 'ALL' || job.skills?.includes(selectedSkill);

      return matchKeyword && matchType && matchLocation && matchSkill;
    });
  }, [jobs, keyword, selectedType, selectedLocation, selectedSkill]);

  const resetFilters = () => {
    setKeyword('');
    setSelectedType('ALL');
    setSelectedLocation('ALL');
    setSelectedSkill('ALL');
  };

  return (
    <div className="jobs-page container">
      {/* Page Header */}
      <div className="page-header-box">
        <div>
          <h1 className="page-title">
            <Briefcase size={28} className="text-primary" /> Cơ Hội Thực Tập & Tuyển Dụng
          </h1>
          <p className="page-subtitle">
            Khám phá {jobs.length} vị trí việc làm thực tập đang tuyển từ các công ty công nghệ hàng đầu
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="search-filter-card">
        <div className="filter-row-top">
          <div className="search-input-wrap">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Tìm theo tên công việc, công ty hoặc từ khóa..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <div className="select-wrap">
            <select
              className="filter-select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="ALL">Tất cả hình thức</option>
              <option value="INTERNSHIP">Thực tập sinh (Intern)</option>
              <option value="FULL_TIME">Toàn thời gian (Full-time)</option>
              <option value="PART_TIME">Bán thời gian (Part-time)</option>
              <option value="REMOTE">Làm việc từ xa (Remote)</option>
            </select>
          </div>

          <div className="select-wrap">
            <select
              className="filter-select"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="ALL">Tất cả địa điểm</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="Hồ Chí Minh">Hồ Chí Minh</option>
            </select>
          </div>

          <button className="btn btn-secondary-sm" onClick={resetFilters} title="Đặt lại bộ lọc">
            <RefreshCw size={14} /> Xóa lọc
          </button>
        </div>

        {/* Skill chips */}
        <div className="skills-filter-chips">
          <span className="skill-filter-label">Kỹ năng phổ biến:</span>
          <button
            className={`filter-chip ${selectedSkill === 'ALL' ? 'active' : ''}`}
            onClick={() => setSelectedSkill('ALL')}
          >
            Tất cả
          </button>
          {INITIAL_SKILLS.slice(0, 10).map((skill) => (
            <button
              key={skill}
              className={`filter-chip ${selectedSkill === skill ? 'active' : ''}`}
              onClick={() => setSelectedSkill(selectedSkill === skill ? 'ALL' : skill)}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="results-count-row">
        <span>Tìm thấy <strong>{filteredJobs.length}</strong> việc làm phù hợp</span>
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <div className="empty-state-box">
          <Briefcase size={48} className="text-muted" />
          <h3>Không tìm thấy công việc nào phù hợp</h3>
          <p>Hãy thử thay đổi từ khóa hoặc điều chỉnh bộ lọc tìm kiếm của bạn.</p>
          <button className="btn btn-primary" onClick={resetFilters}>
            Xem tất cả việc làm
          </button>
        </div>
      ) : (
        <div className="jobs-grid">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onSelect={onSelectJob}
              onApply={onApplyJob}
              isApplied={appliedJobIds.has(job.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
