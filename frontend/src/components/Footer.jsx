import React from 'react';
import { Mail, MapPin, Phone, ExternalLink } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="container footer-content">
        <div className="footer-grid">
          {/* Col 1: Brand Info */}
          <div className="footer-col brand-col">
            <div className="footer-brand" style={{ marginBottom: '16px' }}>
              <Logo size="large" theme="dark" />
            </div>
            <p className="footer-desc">
              Hệ thống Quản lý Tuyển dụng và Thực tập sinh chuẩn UET - Trường Đại học Công nghệ, ĐHQGHN.
              Cầu nối vững chắc giữa sinh viên tài năng và các tập đoàn công nghệ hàng đầu.
            </p>
            <div className="contact-info">
              <p><MapPin size={16} /> 144 Xuân Thủy, Cầu Giấy, Hà Nội</p>
              <p><Mail size={16} /> contact@internhub.edu.vn</p>
              <p><Phone size={16} /> (024) 3754 7461</p>
            </div>
          </div>

          {/* Col 2: Sinh viên */}
          <div className="footer-col">
            <h4>Dành Cho Sinh Viên</h4>
            <ul className="footer-links">
              <li><a href="#jobs">Tìm việc làm thực tập</a></li>
              <li><a href="#cv-builder">Tải lên & quản lý CV</a></li>
              <li><a href="#interview-prep">Cẩm nang phỏng vấn IT</a></li>
              <li><a href="#report-guide">Hướng dẫn viết báo cáo thực tập UET</a></li>
            </ul>
          </div>

          {/* Col 3: Doanh nghiệp */}
          <div className="footer-col">
            <h4>Dành Cho Doanh Nghiệp</h4>
            <ul className="footer-links">
              <li><a href="#post-job">Đăng tin tuyển dụng</a></li>
              <li><a href="#talent-pool">Tìm kiếm hồ sơ sinh viên tài năng</a></li>
              <li><a href="#partner-uet">Chương trình liên kết doanh nghiệp UET</a></li>
              <li><a href="#tech-day">Ngày hội việc làm UET Job Fair</a></li>
            </ul>
          </div>

          {/* Col 4: Công nghệ & Hệ thống */}
          <div className="footer-col">
            <h4>Công Nghệ Hệ Thống</h4>
            <div className="tech-tags">
              <span className="tech-chip">React 19</span>
              <span className="tech-chip">Spring Boot 3</span>
              <span className="tech-chip">Spring Security</span>
              <span className="tech-chip">JWT Auth</span>
              <span className="tech-chip">MySQL / H2</span>
              <span className="tech-chip">RESTful API</span>
            </div>
            <p className="academic-note">

            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 InternHub UET. All rights reserved.</p>
          <p className="made-with">
            Phát triển với tinh thần sáng tạo & chuyên nghiệp
          </p>
        </div>
      </div>
    </footer>
  );
}
