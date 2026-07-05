import paths from './paths';

export interface SubMenuItem {
  name: string;
  pathName: string;
  path: string;
  active?: boolean;
  items?: SubMenuItem[];
}

export interface MenuItem {
  id: string;
  subheader: string;
  path?: string;
  icon?: string;
  avatar?: string;
  active?: boolean;
  items?: SubMenuItem[];
}

const sitemap: MenuItem[] = [
  {
    id: 'dashboard',
    subheader: 'Overview',
    path: paths.dashboard,
    icon: 'mingcute:home-1-fill',
    active: true,
  },
  {
    id: 'destinations',
    subheader: 'Destinations',
    path: paths.destinations,
    icon: 'mingcute:globe-fill',
  },
  {
    id: 'jobs',
    subheader: 'Jobs',
    path: paths.jobs,
    icon: 'mingcute:briefcase-fill',
  },
  {
    id: 'gallery',
    subheader: 'Gallery',
    path: paths.gallery,
    icon: 'mingcute:pic-fill',
  },
  {
    id: 'blogs',
    subheader: 'Blogs',
    path: paths.blogs,
    icon: 'mingcute:document-3-fill',
  },
  {
    id: 'responses',
    subheader: 'Inquiries',
    path: paths.responses,
    icon: 'mingcute:message-3-fill',
  },
  {
    id: 'settings',
    subheader: 'Settings',
    path: '#!',
    icon: 'material-symbols:settings-rounded',
  },
  {
    id: 'account-settings',
    subheader: 'Admin Profile',
    path: '#!',
  },
];

export default sitemap;
