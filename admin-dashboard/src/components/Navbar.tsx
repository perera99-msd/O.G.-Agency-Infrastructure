import { Bell } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  unreadCount: number;
  onProfile?: () => void;
  userInitials?: string;
}

const tabLabels: Record<string, string> = {
  overview: 'Overview',
  destinations: 'Destinations',
  jobs: 'Job Openings',
  gallery: 'Gallery',
  blogs: 'Blogs & News',
  responses: 'Inquiries',
  profile: 'My Profile',
};

export const Navbar: React.FC<NavbarProps> = ({ activeTab, unreadCount, onProfile, userInitials = 'AD' }) => {
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

        <button className="header-notif" title="Notifications">
          <Bell size={15} strokeWidth={2} />
          {unreadCount > 0 && <span className="notif-badge" />}
        </button>

        <button className="header-avatar" title="Open my profile" onClick={onProfile}>
          {userInitials}
        </button>
      </div>
    </header>
  );
};
