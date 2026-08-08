import type { Destination, JobOpening, GalleryItem, BlogPost, ContactMessage, TabType } from '../types';
import {
  Globe2,
  Briefcase,
  Image as ImageIcon,
  FileText,
  MessageSquare,
  ArrowUpRight,
  Clock,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Plane,
} from 'lucide-react';

interface BentoOverviewProps {
  destinations: Destination[];
  jobs: JobOpening[];
  gallery: GalleryItem[];
  blogs: BlogPost[];
  responses: ContactMessage[];
  setActiveTab: (tab: TabType) => void;
}

/* ---------- helpers ---------- */

function timeAgo(dateStr?: string | null): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function daysUntil(dateStr: string): number {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return Infinity;
  return Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

type ActivityType = 'job' | 'gallery' | 'blog' | 'response';

interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  sub: string;
  date: string;
  tab: TabType;
}

const activityMeta: Record<ActivityType, { Icon: React.FC<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>; color: string; bg: string; label: string }> = {
  job: { Icon: Briefcase, color: 'var(--purple)', bg: 'var(--purple-bg)', label: 'Job posted' },
  gallery: { Icon: ImageIcon, color: 'var(--green)', bg: 'var(--green-bg)', label: 'Photo added' },
  blog: { Icon: FileText, color: 'var(--amber)', bg: 'var(--amber-bg)', label: 'Article published' },
  response: { Icon: MessageSquare, color: 'var(--blue)', bg: 'var(--blue-bg)', label: 'New inquiry' },
};

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

  // Jobs closing within the next 7 days — actionable, not shown anywhere else
  const jobsClosingSoon = openJobs
    .map(j => ({ job: j, days: daysUntil(j.deadline) }))
    .filter(x => x.days >= 0 && x.days <= 7)
    .sort((a, b) => a.days - b.days)
    .slice(0, 4);

  const urgentOpenCount = openJobs.filter(j => j.isUrgent).length;
  const attentionCount = newResponses + jobsClosingSoon.length;

  // Unified recent-activity feed across content types (destinations have no date field, so excluded)
  const activityItems: ActivityItem[] = [
    ...jobs
      .filter(j => j.postedAt || j.createdAt)
      .map<ActivityItem>(j => ({
        id: `job-${j.id}`,
        type: 'job',
        title: j.title,
        sub: j.country,
        date: (j.postedAt || j.createdAt) as string,
        tab: 'jobs',
      })),
    ...gallery.map<ActivityItem>(g => ({
      id: `gallery-${g.id}`,
      type: 'gallery',
      title: g.title,
      sub: g.category,
      date: g.dateAdded,
      tab: 'gallery',
    })),
    ...blogs.map<ActivityItem>(b => ({
      id: `blog-${b.id}`,
      type: 'blog',
      title: b.title,
      sub: b.category,
      date: b.publishDate,
      tab: 'blogs',
    })),
    ...responses.map<ActivityItem>(r => ({
      id: `resp-${r.id}`,
      type: 'response',
      title: r.senderName,
      sub: r.destinationOfInterest ? `Interested in ${r.destinationOfInterest}` : r.message,
      date: r.submittedAt,
      tab: 'responses',
    })),
  ]
    .filter(item => !isNaN(new Date(item.date).getTime()))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 7);

  // Featured destinations snapshot — surfaces fields (activeJobs, visaProcessingDays) unused elsewhere
  const featuredDestinations = (() => {
    const featured = destinations.filter(d => d.featured && d.isActive);
    const pool = featured.length > 0 ? featured : destinations.filter(d => d.isActive);
    return pool.slice(0, 4);
  })();

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

      {/* Recent inquiries + Needs attention */}
      <div className="content-split" style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(280px, 340px)' }}>
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
                    <span style={{ fontSize: 10.5, color: 'var(--text-faint)' }}>{timeAgo(r.submittedAt)}</span>
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

        {/* Needs attention */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Needs Attention</p>
              <p style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>Things worth a look today</p>
            </div>
            {attentionCount > 0 ? (
              <span className="tag tag-amber">{attentionCount}</span>
            ) : (
              <span className="tag tag-green">All clear</span>
            )}
          </div>

          <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {newResponses > 0 && (
              <div
                onClick={() => setActiveTab('responses')}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 10, background: 'var(--red-bg)', border: '1px solid var(--red-border)', cursor: 'pointer' }}
              >
                <MessageSquare size={14} strokeWidth={2} style={{ color: 'var(--red)', flexShrink: 0 }} />
                <p style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}>
                  {newResponses} unread {newResponses === 1 ? 'inquiry' : 'inquiries'}
                </p>
                <ArrowUpRight size={13} style={{ color: 'var(--text-faint)' }} />
              </div>
            )}

            {jobsClosingSoon.map(({ job, days }) => (
              <div
                key={job.id}
                onClick={() => setActiveTab('jobs')}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 10, background: days <= 2 ? 'var(--red-bg)' : 'var(--amber-bg)', border: `1px solid ${days <= 2 ? 'var(--red-border)' : 'var(--amber-border)'}`, cursor: 'pointer' }}
              >
                <Clock size={14} strokeWidth={2} style={{ color: days <= 2 ? 'var(--red)' : 'var(--amber)', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }} className="truncate">{job.title}</p>
                  <p style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>Closes in {days === 0 ? 'today' : `${days}d`}</p>
                </div>
              </div>
            ))}

            {urgentOpenCount > 0 && (
              <div
                onClick={() => setActiveTab('jobs')}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 10, background: 'var(--purple-bg)', border: '1px solid var(--purple-border)', cursor: 'pointer' }}
              >
                <AlertTriangle size={14} strokeWidth={2} style={{ color: 'var(--purple)', flexShrink: 0 }} />
                <p style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}>
                  {urgentOpenCount} urgent {urgentOpenCount === 1 ? 'posting' : 'postings'} live
                </p>
                <ArrowUpRight size={13} style={{ color: 'var(--text-faint)' }} />
              </div>
            )}

            {attentionCount === 0 && urgentOpenCount === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '20px 0', textAlign: 'center' }}>
                <CheckCircle2 size={22} style={{ color: 'var(--green)' }} />
                <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
                  No unread inquiries or looming deadlines.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent activity + Destinations snapshot */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)', gap: 16 }}>
        {/* Recent activity */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Recent Activity</p>
            <p style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>Latest updates across every content type</p>
          </div>
          {activityItems.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><Clock size={20} /></div>
              <p className="empty-state-title">Nothing yet</p>
              <p className="empty-state-desc">New jobs, articles, photos, and inquiries will show up here.</p>
            </div>
          ) : (
            activityItems.map((item) => {
              const meta = activityMeta[item.type];
              const { Icon } = meta;
              return (
                <div
                  key={item.id}
                  className="data-row"
                  style={{ padding: '11px 20px', cursor: 'pointer' }}
                  onClick={() => setActiveTab(item.tab)}
                >
                  <div className="stat-icon-wrap" style={{ width: 32, height: 32, borderRadius: 9, background: meta.bg, flexShrink: 0 }}>
                    <Icon size={14} strokeWidth={2} style={{ color: meta.color }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }} className="truncate">{item.title}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }} className="truncate">{meta.label} · {item.sub}</p>
                  </div>
                  <span style={{ fontSize: 10.5, color: 'var(--text-faint)', flexShrink: 0 }}>{timeAgo(item.date)}</span>
                </div>
              );
            })
          )}
        </div>

        {/* Destinations snapshot */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Featured Destinations</p>
              <p style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>Open roles &amp; visa turnaround</p>
            </div>
            <button className="btn btn-ghost" style={{ fontSize: 11.5, padding: '4px 8px' }} onClick={() => setActiveTab('destinations')}>
              View all →
            </button>
          </div>
          {featuredDestinations.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><Globe2 size={20} /></div>
              <p className="empty-state-title">No destinations yet</p>
              <p className="empty-state-desc">Add a corridor to see it summarized here.</p>
            </div>
          ) : (
            featuredDestinations.map((d) => (
              <div
                key={d.id}
                className="data-row"
                style={{ padding: '12px 20px', cursor: 'pointer' }}
                onClick={() => setActiveTab('destinations')}
              >
                <div className="avatar avatar-sm avatar-subtle" style={{ borderRadius: 8, overflow: 'hidden' }}>
                  {d.flag ? (
                    <img src={d.flag} alt={d.country} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <MapPin size={14} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }} className="truncate">{d.country}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }} className="truncate">{d.region}</p>
                </div>
                <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="tag tag-blue">{d.activeJobs} jobs</span>
                  <span className="tag tag-neutral" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Plane size={10} /> {d.visaProcessingDays}d
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};