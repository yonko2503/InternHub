import React from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Bell, CheckCircle2, Clock, Calendar, ArrowRight } from 'lucide-react';

export default function NotificationModal({ onClose, onNavigate }) {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAuth();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-notifs animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-title-row">
            <Bell size={20} className="text-primary" />
            <h3 className="modal-title">Thông báo hệ thống</h3>
          </div>
          <div className="notif-header-actions">
            <button className="btn-text-sm" onClick={markAllNotificationsRead}>
              Đánh dấu tất cả đã đọc
            </button>
            <button className="modal-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="modal-body notifs-list">
          {notifications.length === 0 ? (
            <div className="empty-state-p">
              <Bell size={36} className="text-muted" />
              <p>Chưa có thông báo nào mới.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`notif-card ${notif.isRead ? 'read' : 'unread'}`}
                onClick={() => {
                  markNotificationRead(notif.id);
                  if (notif.link) {
                    onClose();
                    if (notif.link.includes('student')) onNavigate('student-dashboard');
                    else if (notif.link.includes('company')) onNavigate('company-dashboard');
                  }
                }}
              >
                <div className="notif-indicator" />
                <div className="notif-content">
                  <h4 className="notif-title">{notif.title}</h4>
                  <p className="notif-message">{notif.message}</p>
                  <span className="notif-time">
                    <Clock size={12} /> {new Date(notif.createdAt).toLocaleString('vi-VN')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
