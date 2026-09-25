import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Send, 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  Sparkles,
  Link,
  Trash2,
  FileCheck
} from 'lucide-react';

export default function ApplyModal({ job, onClose, onSuccess }) {
  const { user, applyForJob } = useAuth();
  const fileInputRef = useRef(null);

  const [uploadMethod, setUploadMethod] = useState('file'); // 'file' or 'url'
  const [selectedFile, setSelectedFile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(user?.studentProfile?.resumeUrl || '');
  const [coverLetter, setCoverLetter] = useState(
    `Kính gửi Bộ phận Tuyển dụng ${job?.companyName},\n\nEm tên là ${user?.fullName || 'Sinh viên'}, hiện đang học chuyên ngành ${user?.studentProfile?.major || 'CNTT'} tại ${user?.studentProfile?.university || 'UET'}.\nEm nhận thấy vị trí "${job?.title}" rất phù hợp với định hướng phát triển và các kỹ năng của em. Em mong muốn có cơ hội được học hỏi và cống hiến cho công ty.\n\nTrân trọng!`
  );
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!job) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Dung lượng file không được vượt quá 10MB.');
        return;
      }
      setSelectedFile(file);
      setError(null);
      // Create a local blob/preview URL or simulated upload URL
      const fakeUploadedUrl = `https://internhub.uet.edu.vn/uploads/cv/${Date.now()}_${file.name}`;
      setResumeUrl(fakeUploadedUrl);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setResumeUrl(user?.studentProfile?.resumeUrl || '');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (uploadMethod === 'file' && !selectedFile && !resumeUrl) {
      setError('Vui lòng chọn file CV từ máy tính hoặc chuyển sang dán liên kết.');
      return;
    }

    if (uploadMethod === 'url' && !resumeUrl.trim()) {
      setError('Vui lòng nhập đường dẫn liên kết tới CV của bạn.');
      return;
    }

    setLoading(true);

    try {
      let finalResumeUrl = resumeUrl || '/sample-cv.html';

      if (selectedFile) {
        finalResumeUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve(event.target.result);
          reader.onerror = () => resolve('/sample-cv.html');
          reader.readAsDataURL(selectedFile);
        });
      }

      await applyForJob(job.id, coverLetter, finalResumeUrl);
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1200);
    } catch (err) {
      setError(err.message || 'Đã có lỗi xảy ra khi nộp hồ sơ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-md animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Nộp hồ sơ ứng tuyển</h3>
            <p className="modal-subtitle">
              <Building2 size={14} /> {job.companyName} • {job.title}
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div className="modal-success-state">
            <CheckCircle2 size={56} className="text-success animate-bounce" />
            <h3>Nộp đơn ứng tuyển thành công!</h3>
            <p>Hồ sơ và file CV của bạn đã được chuyển tới nhà tuyển dụng {job.companyName}.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="apply-form">
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              {/* Student info summary */}
              <div className="applicant-summary-box">
                <div className="summary-row">
                  <span className="summary-label">Ứng viên:</span>
                  <strong>{user?.fullName} ({user?.email})</strong>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Trường / Chuyên ngành:</span>
                  <span>{user?.studentProfile?.university || 'Đại học Công nghệ - ĐHQGHN (UET)'} • GPA: <strong>{user?.studentProfile?.gpa || '3.68'}</strong></span>
                </div>
              </div>

              {/* CV Upload Type Tabs */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span><FileText size={15} /> Hồ sơ CV ứng tuyển:</span>
                  <div className="cv-tab-mini">
                    <button
                      type="button"
                      className={`cv-tab-btn ${uploadMethod === 'file' ? 'active' : ''}`}
                      onClick={() => setUploadMethod('file')}
                    >
                      <UploadCloud size={13} /> Tải file lên
                    </button>
                    <button
                      type="button"
                      className={`cv-tab-btn ${uploadMethod === 'url' ? 'active' : ''}`}
                      onClick={() => setUploadMethod('url')}
                    >
                      <Link size={13} /> Dán link online
                    </button>
                  </div>
                </label>

                {uploadMethod === 'file' ? (
                  /* FILE UPLOAD DROPZONE */
                  <div className="cv-upload-dropzone-wrap">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      style={{ display: 'none' }}
                      id="cv-file-upload-input"
                    />

                    {!selectedFile ? (
                      <label htmlFor="cv-file-upload-input" className="dropzone-box">
                        <UploadCloud size={36} className="dropzone-icon" />
                        <span className="dropzone-main-text">
                          Nhấn để chọn file CV từ máy tính hoặc kéo thả vào đây
                        </span>
                        <span className="dropzone-sub-text">
                          Hỗ trợ định dạng PDF, DOC, DOCX (Dung lượng tối đa 10MB)
                        </span>
                      </label>
                    ) : (
                      <div className="selected-file-card">
                        <div className="file-info-left">
                          <div className="file-type-badge">PDF</div>
                          <div className="file-details">
                            <span className="file-name">{selectedFile.name}</span>
                            <span className="file-size">
                              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • <span className="text-success"><FileCheck size={12} style={{ display: 'inline' }} /> Sẵn sàng nộp</span>
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn-remove-file"
                          onClick={handleRemoveFile}
                          title="Gỡ bỏ và chọn file khác"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* URL INPUT */
                  <div>
                    <input
                      type="text"
                      className="form-input"
                      value={resumeUrl}
                      onChange={(e) => setResumeUrl(e.target.value)}
                      placeholder="https://drive.google.com/... hoặc link CV online"
                    />
                    <small className="form-hint">
                      Bạn có thể dán link Google Drive (đặt chế độ xem công khai) hoặc TopCV/Notion.
                    </small>
                  </div>
                )}
              </div>

              {/* Cover Letter */}
              <div className="form-group">
                <label className="form-label">
                  <Sparkles size={15} /> Thư giới thiệu bản thân (Cover Letter):
                </label>
                <textarea
                  className="form-textarea"
                  rows={5}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Giới thiệu bản thân, các dự án nổi bật, lý do ứng tuyển..."
                  required
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Hủy bỏ
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Đang gửi...' : <><Send size={15} /> Xác nhận nộp đơn</>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
