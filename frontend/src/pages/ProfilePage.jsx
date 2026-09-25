import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Building2, 
  Save, 
  CheckCircle2, 
  FileText, 
  Code2, 
  Share2, 
  Globe, 
  GraduationCap, 
  MapPin,
  Sparkles,
  Award,
  UploadCloud,
  Image as ImageIcon
} from 'lucide-react';
import { INITIAL_SKILLS } from '../api/mockData';

export default function ProfilePage() {
  const { user, role, updateProfile } = useAuth();
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Student form state
  const [studentData, setStudentData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
    studentCode: user?.studentProfile?.studentCode || '21020001',
    university: user?.studentProfile?.university || 'Đại học Công nghệ - ĐHQGHN (UET)',
    major: user?.studentProfile?.major || 'Công nghệ Thông tin',
    gpa: user?.studentProfile?.gpa || 3.68,
    graduationYear: user?.studentProfile?.graduationYear || 2025,
    bio: user?.studentProfile?.bio || '',
    githubUrl: user?.studentProfile?.githubUrl || '',
    linkedinUrl: user?.studentProfile?.linkedinUrl || '',
    portfolioUrl: user?.studentProfile?.portfolioUrl || '',
    resumeUrl: user?.studentProfile?.resumeUrl || 'https://internhub.uet.edu.vn/cv/sample-cv.pdf',
    skills: user?.studentProfile?.skills || ['Java', 'Spring Boot', 'MySQL'],
  });

  // Company form state
  const [companyData, setCompanyData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    companyName: user?.companyProfile?.companyName || user?.fullName || '',
    logoUrl: user?.companyProfile?.logoUrl || user?.avatar || '',
    website: user?.companyProfile?.website || '',
    address: user?.companyProfile?.address || '',
    industry: user?.companyProfile?.industry || '',
    scale: user?.companyProfile?.scale || '100-250 nhân viên',
    foundedYear: user?.companyProfile?.foundedYear || 2018,
    description: user?.companyProfile?.description || '',
  });

  const handleStudentAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Dung lượng ảnh không được vượt quá 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setStudentData((prev) => ({
          ...prev,
          avatar: event.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCompanyLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Dung lượng ảnh không được vượt quá 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setCompanyData((prev) => ({
          ...prev,
          logoUrl: event.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleStudentSkill = (skill) => {
    setStudentData((prev) => {
      const exists = prev.skills.includes(skill);
      return {
        ...prev,
        skills: exists ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill],
      };
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (role === 'ROLE_STUDENT') {
      updateProfile(studentData);
    } else {
      updateProfile(companyData);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="profile-page container">
      <div className="page-header-box">
        <div>
          <h1 className="page-title">
            <User size={28} className="text-primary" /> Quản Lý Hồ Sơ Cá Nhân & Thông Tin
          </h1>
          <p className="page-subtitle">
            Cập nhật thông tin chi tiết để tăng độ tin cậy và cơ hội kết nối với nhà tuyển dụng
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="alert alert-success animate-fade-in">
          <CheckCircle2 size={20} /> Hồ sơ của bạn đã được cập nhật thành công!
        </div>
      )}

      {/* STUDENT PROFILE FORM */}
      {role === 'ROLE_STUDENT' && (
        <form onSubmit={handleSave} className="profile-form-grid">
          {/* Col Left: Avatar & Bio */}
          <div className="profile-card profile-sidebar-card">
            <div className="avatar-preview-box">
              <img
                src={studentData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80'}
                alt="Avatar"
                className="profile-avatar-lg"
              />
              <div className="form-group avatar-url-input" style={{ width: '100%' }}>
                <label className="form-label-sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Ảnh đại diện (URL hoặc tải file):</span>
                </label>
                <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                  <input
                    type="text"
                    className="form-input-sm"
                    value={studentData.avatar}
                    onChange={(e) => setStudentData({ ...studentData, avatar: e.target.value })}
                    placeholder="https://... hoặc tải từ máy"
                    style={{ flex: 1 }}
                  />
                  <label className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <UploadCloud size={13} /> Tải ảnh
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleStudentAvatarUpload}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="profile-quick-stats">
              <div className="quick-stat-item">
                <span className="stat-label">Điểm GPA</span>
                <span className="stat-val text-primary">{studentData.gpa} / 4.0</span>
              </div>
              <div className="quick-stat-item">
                <span className="stat-label">Năm tốt nghiệp</span>
                <span className="stat-val">{studentData.graduationYear}</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span><FileText size={15} /> Hồ sơ CV mặc định:</span>
                {studentData.resumeUrl && (
                  <a
                    href={studentData.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: '0.75rem', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                  >
                    Xem CV hiện tại <Globe size={11} />
                  </a>
                )}
              </label>

              <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                <input
                  type="text"
                  className="form-input"
                  value={studentData.resumeUrl}
                  onChange={(e) => setStudentData({ ...studentData, resumeUrl: e.target.value })}
                  placeholder="https://... hoặc tải file từ máy tính"
                />
                <label className="btn btn-secondary" style={{ padding: '0 12px', cursor: 'pointer', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem' }}>
                  <FileText size={14} /> Tải file CV
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 10 * 1024 * 1024) {
                          alert('Dung lượng file CV không được vượt quá 10MB.');
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setStudentData((prev) => ({
                            ...prev,
                            resumeUrl: event.target.result,
                          }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
              <small className="form-hint" style={{ fontSize: '0.75rem' }}>
                Hỗ trợ PDF, DOC, DOCX hoặc dán trực tiếp link Google Drive / Notion.
              </small>
            </div>
          </div>

          {/* Col Right: Detailed Fields */}
          <div className="profile-card profile-main-card">
            <h3 className="card-section-title">
              <GraduationCap size={20} className="text-primary" /> Thông tin học vấn & Liên hệ
            </h3>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Họ và tên sinh viên:</label>
                <input
                  type="text"
                  className="form-input"
                  value={studentData.fullName}
                  onChange={(e) => setStudentData({ ...studentData, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mã số sinh viên (MSSV):</label>
                <input
                  type="text"
                  className="form-input"
                  value={studentData.studentCode}
                  onChange={(e) => setStudentData({ ...studentData, studentCode: e.target.value })}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Số điện thoại:</label>
                <input
                  type="text"
                  className="form-input"
                  value={studentData.phone}
                  onChange={(e) => setStudentData({ ...studentData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Trường đại học:</label>
                <input
                  type="text"
                  className="form-input"
                  value={studentData.university}
                  onChange={(e) => setStudentData({ ...studentData, university: e.target.value })}
                />
              </div>
            </div>

            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">Chuyên ngành:</label>
                <input
                  type="text"
                  className="form-input"
                  value={studentData.major}
                  onChange={(e) => setStudentData({ ...studentData, major: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Điểm GPA tích lũy (hệ 4):</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  className="form-input"
                  value={studentData.gpa}
                  onChange={(e) => setStudentData({ ...studentData, gpa: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Năm tốt nghiệp dự kiến:</label>
                <input
                  type="number"
                  className="form-input"
                  value={studentData.graduationYear}
                  onChange={(e) => setStudentData({ ...studentData, graduationYear: Number(e.target.value) })}
                />
              </div>
            </div>

            {/* Skills selection */}
            <div className="form-group">
              <label className="form-label">
                <Sparkles size={16} /> Kỹ năng chuyên môn (chọn các kỹ năng bạn có):
              </label>
              <div className="skills-selectable-grid">
                {INITIAL_SKILLS.map((sk) => {
                  const active = studentData.skills.includes(sk);
                  return (
                    <button
                      key={sk}
                      type="button"
                      className={`skill-select-chip ${active ? 'active' : ''}`}
                      onClick={() => toggleStudentSkill(sk)}
                    >
                      {sk}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Social / Portfolio Links */}
            <h3 className="card-section-title">
              <Globe size={20} className="text-primary" /> Mạng xã hội & Hồ sơ lập trình
            </h3>

            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">
                  <Code2 size={14} /> GitHub Profile:
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={studentData.githubUrl}
                  onChange={(e) => setStudentData({ ...studentData, githubUrl: e.target.value })}
                  placeholder="https://github.com/..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Share2 size={14} /> LinkedIn Profile:
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={studentData.linkedinUrl}
                  onChange={(e) => setStudentData({ ...studentData, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Globe size={14} /> Portfolio cá nhân:
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={studentData.portfolioUrl}
                  onChange={(e) => setStudentData({ ...studentData, portfolioUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Giới thiệu bản thân (Bio):</label>
              <textarea
                rows={4}
                className="form-textarea"
                value={studentData.bio}
                onChange={(e) => setStudentData({ ...studentData, bio: e.target.value })}
                placeholder="Giới thiệu về mục tiêu nghề nghiệp, kinh nghiệm và đam mê công nghệ..."
              />
            </div>

            <div className="form-actions-row">
              <button type="submit" className="btn btn-primary">
                <Save size={16} /> Lưu thay đổi hồ sơ
              </button>
            </div>
          </div>
        </form>
      )}

      {/* COMPANY PROFILE FORM */}
      {role === 'ROLE_COMPANY' && (
        <form onSubmit={handleSave} className="profile-form-grid">
          <div className="profile-card profile-sidebar-card">
            <div className="avatar-preview-box">
              <img
                src={companyData.logoUrl || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=200&h=200&q=80'}
                alt="Company Logo"
                className="profile-avatar-lg"
              />
              <div className="form-group avatar-url-input" style={{ width: '100%' }}>
                <label className="form-label-sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Logo doanh nghiệp (URL / Tải file):</span>
                </label>
                <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                  <input
                    type="text"
                    className="form-input-sm"
                    value={companyData.logoUrl}
                    onChange={(e) => setCompanyData({ ...companyData, logoUrl: e.target.value })}
                    placeholder="https://... hoặc tải từ máy"
                    style={{ flex: 1 }}
                  />
                  <label className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <UploadCloud size={13} /> Tải logo
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleCompanyLogoUpload}
                    />
                  </label>
                </div>
                <small className="form-hint" style={{ fontSize: '0.75rem', display: 'block', textAlign: 'center' }}>
                  Hỗ trợ PNG, JPG, SVG, WebP (Tối đa 5MB)
                </small>
              </div>
            </div>
          </div>

          <div className="profile-card profile-main-card">
            <h3 className="card-section-title">
              <Building2 size={20} className="text-primary" /> Thông tin doanh nghiệp
            </h3>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Tên công ty:</label>
                <input
                  type="text"
                  className="form-input"
                  value={companyData.companyName}
                  onChange={(e) => setCompanyData({ ...companyData, companyName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Lĩnh vực hoạt động:</label>
                <input
                  type="text"
                  className="form-input"
                  value={companyData.industry}
                  onChange={(e) => setCompanyData({ ...companyData, industry: e.target.value })}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Địa chỉ trụ sở:</label>
                <input
                  type="text"
                  className="form-input"
                  value={companyData.address}
                  onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Website:</label>
                <input
                  type="text"
                  className="form-input"
                  value={companyData.website}
                  onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Mô tả doanh nghiệp & Văn hóa làm việc:</label>
              <textarea
                rows={5}
                className="form-textarea"
                value={companyData.description}
                onChange={(e) => setCompanyData({ ...companyData, description: e.target.value })}
              />
            </div>

            <div className="form-actions-row">
              <button type="submit" className="btn btn-primary">
                <Save size={16} /> Cập nhật thông tin công ty
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ADMIN VIEW */}
      {role === 'ROLE_ADMIN' && (
        <div className="profile-card">
          <h3>Tài khoản Quản Trị Viên (Admin)</h3>
          <p>Tài khoản có toàn quyền quản lý hệ thống, duyệt tin tuyển dụng và theo dõi thống kê.</p>
        </div>
      )}
    </div>
  );
}
