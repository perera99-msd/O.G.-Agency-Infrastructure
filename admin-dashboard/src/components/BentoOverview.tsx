import type { Destination, JobOpening, GalleryItem, BlogPost, ContactMessage, TabType } from '../types';
import { Globe2, Briefcase, Image as ImageIcon, FileText, MessageSquare, ArrowUpRight, Activity } from 'lucide-react';

interface BentoOverviewProps {
  destinations: Destination[];
  jobs: JobOpening[];
  gallery: GalleryItem[];
  blogs: BlogPost[];
  responses: ContactMessage[];
  setActiveTab: (tab: TabType) => void;
}

export const BentoOverview: React.FC<BentoOverviewProps> = ({
  destinations, jobs, gallery, blogs, responses, setActiveTab,
}) => {
  const newResponses = responses.filter(r => r.status === 'new').length;
  const currentDate = new Date();
  const openJobs = jobs.filter((job) => job.active && new Date(job.deadline) >= currentDate);
  const totalPositions = openJobs.reduce((a, j) => a + (j.positionsAvailable || 1), 0);
  const activeDestinations = destinations.filter((destination) => destination.isActive).length;
  const activeJobs = openJobs.length;

  const stats = [
    {
      id: 'destinations' as TabType,
      label: 'Active Corridors',
      value: activeDestinations,
      sub: `${destinations.length} total`,
      Icon: Globe2,
      color: 'var(--blue)',
      colorBg: 'var(--blue-bg)',
    },
    {
      id: 'jobs' as TabType,
      label: 'Open Positions',
      value: totalPositions,
      sub: `${activeJobs} active postings`,
      Icon: Briefcase,
      color: 'var(--purple)',
      colorBg: 'var(--purple-bg)',
    },
    {
      id: 'gallery' as TabType,
      label: 'Gallery Assets',
      value: gallery.length,
      sub: 'Images uploaded',
      Icon: ImageIcon,
      color: 'var(--green)',
      colorBg: 'var(--green-bg)',
    },
    {
      id: 'blogs' as TabType,
      label: 'Published Articles',
      value: blogs.length,
      sub: `${blogs.filter((post) => post.sourceType === 'ai').length} AI-managed`,
      Icon: FileText,
      color: 'var(--amber)',
      colorBg: 'var(--amber-bg)',
    },
  ];

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Hero Banner */}
      <div className="card overview-hero" style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
        <span className="overview-hero-orb overview-hero-orb-one" aria-hidden="true" />
        <span className="overview-hero-orb overview-hero-orb-two" aria-hidden="true" />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>
            Command Center
          </p>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.4px', lineHeight: 1.2 }}>
            O.G. Agency Dashboard
          </h1>
          <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.7)', marginTop: 4, maxWidth: 440 }}>
            Manage destinations, vacancies, gallery, editorial content, and client inquiries.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0, position: 'relative', zIndex: 1 }}>
          <button className="btn btn-secondary overview-hero-secondary" onClick={() => setActiveTab('jobs')}>
            Post a Job
          </button>
          <button className="btn btn-primary overview-hero-primary" onClick={() => setActiveTab('responses')}>
            <MessageSquare size={13} strokeWidth={2} />
            Inquiries {newResponses > 0 && `(${newResponses})`}
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="bento-grid">
        {stats.map(({ id, label, value, sub, Icon, color, colorBg }) => (
          <div
            key={id}
            className="card card-clickable stat-card"
            onClick={() => setActiveTab(id)}
            style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="stat-icon-wrap" style={{ background: colorBg }}>
                <Icon size={17} strokeWidth={1.8} style={{ color }} />
              </div>
              <ArrowUpRight size={14} strokeWidth={2} style={{ color: 'var(--text-faint)' }} />
            </div>
            <div>
              <p className="stat-label">{label}</p>
              <p className="stat-value">{value}</p>
              <p className="stat-sub">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent inquiries + System status */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(260px, 320px)', gap: 16 }}>
        {/* Recent inquiries */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Recent Inquiries</p>
              <p style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>Latest consultation requests</p>
            </div>
            {newResponses > 0 && (
              <span className="tag tag-red">{newResponses} New</span>
            )}
          </div>
          {responses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><MessageSquare size={20} /></div>
              <p className="empty-state-title">No inquiries yet</p>
              <p className="empty-state-desc">Inquiries from your website will appear here.</p>
            </div>
          ) : (
            <>
              {responses.slice(0, 4).map((r) => (
                <div
                  key={r.id}
                  className="data-row"
                  style={{ padding: '12px 20px', cursor: 'pointer' }}
                  onClick={() => setActiveTab('responses')}
                >
                  <div className="avatar avatar-sm avatar-subtle">
                    {(r.senderName || '?').charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{r.senderName}</p>
                    <p style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 1 }} className="truncate">{r.message}</p>
                  </div>
                  <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <span className={`tag ${r.status === 'new' ? 'tag-red' : r.status === 'replied' ? 'tag-green' : 'tag-neutral'}`}>
                      {r.status}
                    </span>
                  </div>
                </div>
              ))}
              <div style={{ padding: '10px 20px', borderTop: '1px solid var(--border)' }}>
                <button className="btn btn-ghost" style={{ fontSize: 12, padding: '4px 8px' }} onClick={() => setActiveTab('responses')}>
                  View all inquiries →
                </button>
              </div>
            </>
          )}
        </div>

        {/* System status */}
        <div className="card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Activity size={15} style={{ color: 'var(--green)' }} />
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>System Status</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Express Gateway', value: 'Online', ok: true },
              { label: 'Firebase Firestore', value: 'Connected', ok: true },
              { label: 'Jobs API', value: `${jobs.length} records`, ok: true },
              { label: 'Auth Mode', value: 'Firebase Token', ok: true },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', background: 'var(--bg)', borderRadius: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className={`status-dot ${item.ok ? 'status-dot-green' : 'status-dot-amber'}`} />
                  <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>{item.label}</p>
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: item.ok ? 'var(--green)' : 'var(--amber)' }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
            <p style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>Content Summary</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {[
                { label: 'Destinations', val: destinations.length },
                { label: 'Job Posts', val: jobs.length },
                { label: 'Gallery', val: gallery.length },
                { label: 'Articles', val: blogs.length },
              ].map(item => (
                <div key={item.label} style={{ background: 'var(--bg)', borderRadius: 8, padding: '9px 10px' }}>
                  <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{item.val}</p>
                  <p style={{ fontSize: 10.5, color: 'var(--text-faint)', marginTop: 2 }}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
