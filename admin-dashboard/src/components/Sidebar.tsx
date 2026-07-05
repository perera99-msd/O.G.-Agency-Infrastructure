import type { TabType } from '../types';
import {
  LayoutDashboard,
  Globe2,
  Briefcase,
  Image as ImageIcon,
  FileText,
  MessageSquare,
  Monitor,
} from 'lucide-react';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  unreadCount: number;
}

const navItems: { id: TabType; label: string; Icon: React.FC<{ size?: number; strokeWidth?: number }> }[] = [
  { id: 'overview', label: 'Overview', Icon: LayoutDashboard },
  { id: 'destinations', label: 'Destinations', Icon: Globe2 },
  { id: 'jobs', label: 'Job Openings', Icon: Briefcase },
  { id: 'gallery', label: 'Gallery', Icon: ImageIcon },
  { id: 'blogs', label: 'Blogs & News', Icon: FileText },
  { id: 'responses', label: 'Inquiries', Icon: MessageSquare },
  { id: 'dashdark', label: 'Dashdark UI', Icon: Monitor },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, unreadCount }) => {
  return (
    <aside className="sidebar">
      <p className="sidebar-section-label">Navigation</p>

      {navItems.map(({ id, label, Icon }) => (
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

      <div className="sidebar-footer">
        <div className="sidebar-footer-card">
          <p className="sidebar-footer-label">Demo Mode Active</p>
          <p className="sidebar-footer-desc">
            Data is local. Connect the Node.js/Firebase backend to persist changes live.
          </p>
        </div>
      </div>
    </aside>
  );
};
