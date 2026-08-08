import React, { useState } from 'react';
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
  UserPlus,
  ClipboardList,
  Stethoscope,
  ChevronDown,
  Globe,
  Users,
  Settings,
  Smartphone,
} from 'lucide-react';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  unreadCount: number;
  pwaUnreadCount?: number;
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

const customerNavItems: { id: TabType; label: string; Icon: React.FC<{ size?: number; strokeWidth?: number }> }[] = [
  { id: 'emp-manage', label: 'Customer Manager', Icon: Users },
  { id: 'emp-register', label: 'Register Customer', Icon: UserPlus },
  { id: 'emp-status', label: 'Customer Status', Icon: ClipboardList },
  { id: 'emp-medical', label: 'Medical Management', Icon: Stethoscope },
  { id: 'emp-user-docs', label: 'User Documents', Icon: FileText },
  { id: 'pwa-control', label: 'PWA Control', Icon: Smartphone },
  { id: 'pwa-inquiries', label: 'PWA Inquiries', Icon: MessageSquare },
];

const settingsNavItems: { id: TabType; label: string; Icon: React.FC<{ size?: number; strokeWidth?: number }> }[] = [
  { id: 'notifications', label: 'Notifications', Icon: Bell },
  { id: 'profile', label: 'My Profile', Icon: UserRound },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, unreadCount, pwaUnreadCount = 0, role: _role, onLogout }) => {
  const isSettingsActive = settingsNavItems.some(item => item.id === activeTab);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    settings: isSettingsActive,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img src="/Logo-removebg-preview.png" alt="O.G. Agency Logo" className="sidebar-brand-logo" />
        <div>
          <p className="sidebar-brand-name">O.G. Agency</p>
          <p className="sidebar-brand-subtitle">Admin Dashboard</p>
        </div>
      </div>

      {/* Website Section - Static, always listed */}
      <div className="sidebar-accordion-header" style={{ cursor: 'default' }}>
        <div className="sidebar-accordion-header-left">
          <Globe size={16} strokeWidth={2} style={{ color: 'var(--accent)' }} />
          <div>
            <div className="sidebar-accordion-title">Website</div>
            <div className="sidebar-accordion-sub">Main Content</div>
          </div>
        </div>
      </div>

      <div className="sidebar-accordion-content">
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
      </div>

      {/* Customers Section - Static, always listed */}
      <div className="sidebar-accordion-header" style={{ cursor: 'default' }}>
        <div className="sidebar-accordion-header-left">
          <Users size={16} strokeWidth={2} style={{ color: 'var(--accent)' }} />
          <div>
            <div className="sidebar-accordion-title">Customers</div>
            <div className="sidebar-accordion-sub">Customer Content</div>
          </div>
        </div>
      </div>

      <div className="sidebar-accordion-content">
        {customerNavItems.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`nav-item${activeTab === id ? ' active' : ''}`}
          >
            <span className="nav-item-icon">
              <Icon size={15} strokeWidth={2} />
            </span>
            {label}
            {id === 'pwa-inquiries' && pwaUnreadCount > 0 && (
              <span className="nav-badge" style={{ background: '#ef4444' }}>{pwaUnreadCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Settings Section - Accordion dropdown logic kept */}
      <button 
        className="sidebar-accordion-header" 
        onClick={() => toggleSection('settings')}
        type="button"
      >
        <div className="sidebar-accordion-header-left">
          <Settings size={16} strokeWidth={2} style={{ color: 'var(--accent)' }} />
          <div>
            <div className="sidebar-accordion-title">Settings</div>
            <div className="sidebar-accordion-sub">Profile & Notification</div>
          </div>
        </div>
        <ChevronDown 
          size={16} 
          className={`sidebar-accordion-chevron${openSections.settings ? ' open' : ''}`} 
        />
      </button>

      {openSections.settings && (
        <div className="sidebar-accordion-content">
          {settingsNavItems.map(({ id, label, Icon }) => (
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
        </div>
      )}

      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={onLogout}>
          <LogOut size={15} strokeWidth={2} />
          Log out
        </button>
      </div>
    </aside>
  );
};
