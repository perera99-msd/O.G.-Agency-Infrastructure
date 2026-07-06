import type { Destination, JobOpening, GalleryItem, BlogPost, ContactMessage, TabType } from '../types';
import { Globe2, Briefcase, Image as ImageIcon, FileText, MessageSquare, ArrowUpRight } from 'lucide-react';

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
  const totalPositions = jobs.reduce((a, j) => {
    const job = j as unknown as Record<string, unknown>;
    const positions =
      (typeof job.positionsAvailable === 'number' ? job.positionsAvailable : undefined) ??
      (typeof job.positions === 'number' ? job.positions : undefined) ??
      (typeof job.openings === 'number' ? job.openings : undefined) ??
      0;
    return a + positions;
  }, 0);

  const stats = [
    {
      id: 'destinations' as TabType,
      label: 'Active Corridors',
      value: destinations.length,
      sub: destinations.length > 0 ? destinations.slice(0, 3).map(d => d.country).join(' · ') : 'No active corridors',
      Icon: Globe2,
      color: 'var(--blue)',
      colorBg: 'var(--blue-bg)',
    },
    {
      id: 'jobs' as TabType,
      label: 'Open Positions',
      value: totalPositions,
      sub: `Across ${jobs.length} job postings`,
      Icon: Briefcase,
      color: 'var(--purple)',
      colorBg: 'var(--purple-bg)',
    },
    {
      id: 'gallery' as TabType,
      label: 'Gallery Assets',
      value: gallery.length,
      sub: 'Departures · Workplaces',
      Icon: ImageIcon,
      color: 'var(--green)',
      colorBg: 'var(--green-bg)',
    },
    {
      id: 'blogs' as TabType,
      label: 'Published Articles',
      value: blogs.length,
      sub: blogs.length > 0 ? Array.from(new Set(blogs.map(b => b.category))).slice(0, 3).join(' · ') : 'No published articles',
      Icon: FileText,
      color: 'var(--amber)',
      colorBg: 'var(--amber-bg)',
    },
  ];

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Welcome strip */}
      <div className="card" style={{ padding: '22px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: 6 }}>
            Executive Command Center
          </p>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
            O.G. Agency Infrastructure
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 5, maxWidth: 500 }}>
            Manage destinations, vacancies, gallery, editorial content, and client inquiries — all in one place.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          <button className="btn btn-secondary" onClick={() => setActiveTab('jobs')}>
            Post a Job
          </button>
          <button className="btn btn-primary" onClick={() => setActiveTab('responses')}>
            <MessageSquare size={14} strokeWidth={2} />
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
            style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="stat-icon-wrap" style={{ background: colorBg }}>
                <Icon size={18} strokeWidth={1.8} style={{ color }} />
              </div>
              <ArrowUpRight size={15} strokeWidth={2} style={{ color: 'var(--text-faint)' }} />
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>
        {/* Recent inquiries */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Recent Inquiries</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Latest consultation requests</p>
            </div>
            {newResponses > 0 && (
              <span className="tag tag-red">{newResponses} New</span>
            )}
          </div>
          {responses.length === 0 ? (
            <div style={{ padding: '30px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              No recent inquiries
            </div>
          ) : (
            responses.slice(0, 4).map((r, i) => (
              <div
                key={r.id}
                style={{
                  padding: '13px 20px',
                  borderBottom: i < 3 && i < responses.length - 1 ? '1px solid var(--border)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  cursor: 'pointer',
                  transition: 'background 0.12s',
                }}
                onClick={() => setActiveTab('responses')}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
                onMouseLeave={e => (e.currentTarget.style.background = '')}
              >
                <div style={{
                  width: 34, height: 34, borderRadius: 8,
                  background: 'var(--accent-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 12, color: 'var(--accent)', flexShrink: 0,
                }}>
                  {r.senderName.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{r.senderName}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }} className="truncate">{r.message}</p>
                </div>
                <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <span className={`tag ${r.status === 'new' ? 'tag-red' : r.status === 'replied' ? 'tag-green' : 'tag-neutral'}`}>
                    {r.status}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>{r.submittedAt}</span>
                </div>
              </div>
            ))
          )}
          <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)' }}>
            <button className="btn btn-ghost" style={{ fontSize: 12, padding: '5px 8px' }} onClick={() => setActiveTab('responses')}>
              View all inquiries →
            </button>
          </div>
        </div>

        {/* System status */}
        <div className="card" style={{ padding: '20px' }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>System Status</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Express Gateway', value: 'Online :5000', ok: true },
              { label: 'Firebase Firestore', value: 'Connected', ok: true },
              { label: 'Vercel Deployment', value: 'Build Passing', ok: true },
              { label: 'Auth Mode', value: 'Demo (Bypassed)', ok: false },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg)', borderRadius: 8, border: '1px solid var(--border)' }}>
                <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>{item.label}</p>
                <span className={`tag ${item.ok ? 'tag-green' : 'tag-amber'}`} style={{ fontSize: 11 }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Content Summary</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { label: 'Destinations', val: destinations.length },
                { label: 'Job Posts', val: jobs.length },
                { label: 'Gallery', val: gallery.length },
                { label: 'Articles', val: blogs.length },
              ].map(item => (
                <div key={item.label} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px' }}>
                  <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{item.val}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
