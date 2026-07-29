import type { TabType, AdminRole } from '../types';
import {
  LayoutDashboard,
  Globe2,
  Briefcase,
  Image as ImageIcon,
  FileText,
  LogOut,
  MessageSquare,
  UserRound,
  Bell,
} from 'lucide-react';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  unreadCount: number;
  role: AdminRole;
  onLogout: () => void;
}

const mainNavItems: { id: TabType; label: string; Icon: React.FC<{ size?: number; strokeWidth?: number }> }[] = [
  { id: 'overview', label: 'Overview', Icon: LayoutDashboard },
  { id: 'destinations', label: 'Destinations', Icon: Globe2 },
  { id: 'jobs', label: 'Job Openings', Icon: Briefcase },
  { id: 'gallery', label: 'Gallery', Icon: ImageIcon },
  { id: 'blogs', label: 'Blogs & News', Icon: FileText },
  { id: 'responses', label: 'Inquiries', Icon: MessageSquare },
];

const accountNavItems: { id: TabType; label: string; Icon: React.FC<{ size?: number; strokeWidth?: number }> }[] = [
  { id: 'notifications', label: 'Notifications', Icon: Bell },
  { id: 'profile', label: 'My Profile', Icon: UserRound },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, unreadCount, role: _role, onLogout }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img src="/Logo-removebg-preview.png" alt="O.G. Agency Logo" className="sidebar-brand-logo" />
        <div>
          <p className="sidebar-brand-name">O.G. Agency</p>
          <p className="sidebar-brand-subtitle">Admin Dashboard</p>
        </div>
      </div>

      <p className="sidebar-section-label">Main</p>
      {mainNavItems.map(({ id, label, Icon }) => (
        <button
          key={id}
          onClick={() => setActiveTab(id)}
          className={`nav-item${activeTab === id ? ' active' : ''}`}
        >
          <span className="nav-item-icon">
            <Icon size={15} strokeWidth={2} />
          </span>
          {label}
          {id === 'responses' && unreadCount > 0 && (
            <span className="nav-badge">{unreadCount}</span>
          )}
        </button>
      ))}

      <div className="sidebar-divider" />
      <p className="sidebar-section-label">Account</p>
      {accountNavItems.map(({ id, label, Icon }) => (
        <button
          key={id}
          onClick={() => setActiveTab(id)}
          className={`nav-item${activeTab === id ? ' active' : ''}`}
        >
          <span className="nav-item-icon">
            <Icon size={15} strokeWidth={2} />
          </span>
          {label}
          {id === 'notifications' && unreadCount > 0 && (
            <span className="nav-badge">{unreadCount}</span>
          )}
        </button>
      ))}

      <div className="sidebar-footer">
        <div className="sidebar-footer-card">
          <p className="sidebar-footer-label">Live Operations</p>
          <p className="sidebar-footer-desc">
            All data synced with Firebase and backend APIs in real-time.
          </p>
        </div>
        <button className="sidebar-logout" onClick={onLogout}>
          <LogOut size={15} strokeWidth={2} />
          Log out
        </button>
      </div>
    </aside>
  );
};
