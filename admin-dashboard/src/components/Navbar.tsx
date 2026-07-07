import { Bell, LogOut } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  unreadCount: number;
  onLogout?: () => void;
}

const tabLabels: Record<string, string> = {
  overview: 'Overview',
  destinations: 'Destinations',
  jobs: 'Job Openings',
  gallery: 'Gallery',
  blogs: 'Blogs & News',
  responses: 'Inquiries',
};

export const Navbar: React.FC<NavbarProps> = ({ activeTab, unreadCount, onLogout }) => {
  return (
    <header className="header">
      <div className="header-brand">
        <div className="header-logo">OG</div>
        <div>
          <p className="header-name">O.G. Agency</p>
          <p className="header-sub">Admin Dashboard</p>
        </div>
      </div>

      <div className="header-right">
        <span className="header-module">{tabLabels[activeTab] ?? activeTab}</span>

        <div className="header-status">
          <span className="dot-pulse" />
          Live Sync
        </div>

        <button className="header-notif" title="Notifications">
          <Bell size={15} strokeWidth={2} />
          {unreadCount > 0 && <span className="notif-badge" />}
        </button>

        <div className="header-avatar" title="Senior Administrator">
          AD
        </div>

        {onLogout && (
          <button 
            onClick={onLogout}
            className="header-notif" 
            style={{ marginLeft: '4px', color: '#ef4444' }} 
            title="Log Out of Executive Portal"
          >
            <LogOut size={16} strokeWidth={2} />
          </button>
        )}
      </div>
    </header>
  );
};
