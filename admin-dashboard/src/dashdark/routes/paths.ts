export const rootPaths = {
  root: '/',
  pagesRoot: 'pages',
  authRoot: 'authentication',
  errorRoot: 'error',
};

export default {
  dashboard: `/`,
  destinations: `/destinations`,
  jobs: `/jobs`,
  gallery: `/gallery`,
  blogs: `/blogs`,
  responses: `/responses`,

  // Keep these for future/auth
  signin: `/${rootPaths.authRoot}/signin`,
  signup: `/${rootPaths.authRoot}/sign-up`,
  forgotPassword: `/${rootPaths.authRoot}/forgot-password`,

  comingSoon: `/coming-soon`,
  404: `/${rootPaths.errorRoot}/404`,
};
