import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import type { ContactMessage, TabType, PWAChatThread } from '../types';
import { NotificationsDropdown } from './NotificationsDropdown';

interface NavbarProps {
  activeTab: string;
  unreadCount: number;
  pwaUnreadCount?: number;
  responses?: ContactMessage[];
  pwaChats?: PWAChatThread[];
  onUpdateStatus?: (id: string, status: ContactMessage['status']) => void;
  onMarkAllAsRead?: () => void;
  onDeleteResponse?: (id: string) => void;
  onNavigate?: (tab: TabType) => void;
  onProfile?: () => void;
  userInitials?: string;
  userPhotoUrl?: string;
}

const tabLabels: Record<string, string> = {
  overview: 'Overview',
  destinations: 'Destinations',
  jobs: 'Job Openings',
  gallery: 'Gallery',
  blogs: 'Blogs & News',
  responses: 'Inquiries',
  notifications: 'Notification Center',
  profile: 'My Profile',
  admins: 'Administrators',
  'emp-manage': 'Customer Manager',
  'emp-register': 'Register Customer',
  'emp-status': 'Customer Status',
  'emp-search': 'Search Customer',
  'emp-edit': 'Edit Customer',
  'emp-filter': 'Filter System',
  'emp-medical': 'Medical Management',
  'emp-user-docs': 'User Documents',
  'pwa-control': 'PWA Access Control',
  'pwa-inquiries': 'PWA Customer Inquiries',
};

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  unreadCount,
  pwaUnreadCount = 0,
  responses = [],
  pwaChats = [],
  onUpdateStatus = () => {},
  onMarkAllAsRead = () => {},
  onDeleteResponse = () => {},
  onNavigate = () => {},
  onProfile,
  userInitials = 'AD',
  userPhotoUrl,
}) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const totalUnreadBadge = unreadCount + pwaUnreadCount;

  return (
    <header className="header">
      <div className="header-left">
        <div>
          <h1 className="header-page-title">{tabLabels[activeTab] ?? activeTab}</h1>
          <p className="header-breadcrumb">Dashboard / {tabLabels[activeTab] ?? activeTab}</p>
        </div>
      </div>

      <div className="header-right">
        <div className="header-status">
          <span className="dot-pulse" />
          Live Sync
        </div>

        {/* Notifications Dropdown Container */}
        <div style={{ position: 'relative', zIndex: 1000 }}>
          <button
            className={`header-notif${isNotifOpen ? ' active' : ''}`}
            title="Notifications"
            onClick={() => setIsNotifOpen((prev) => !prev)}
            style={{ position: 'relative' }}
          >
            <Bell size={15} strokeWidth={2} />
            {totalUnreadBadge > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  background: '#ef4444',
                  color: 'white',
                  fontSize: 10,
                  fontWeight: 800,
                  minWidth: 16,
                  height: 16,
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                  boxShadow: '0 0 0 2px var(--bg)',
                }}
              >
                {totalUnreadBadge > 9 ? '9+' : totalUnreadBadge}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <NotificationsDropdown
              responses={responses}
              pwaChats={pwaChats}
              onUpdateStatus={onUpdateStatus}
              onMarkAllAsRead={onMarkAllAsRead}
              onDelete={onDeleteResponse}
              onNavigate={onNavigate}
              onClose={() => setIsNotifOpen(false)}
            />
          )}
        </div>


        {/* User Profile Avatar Button */}
        <button
          className="header-avatar"
          title="Open my profile"
          onClick={onProfile}
          style={{ overflow: 'hidden', padding: 0 }}
        >
          {userPhotoUrl ? (
            <img
              src={userPhotoUrl}
              alt="Admin Profile"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            userInitials
          )}
        </button>
      </div>
    </header>
  );
};
