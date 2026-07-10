export const routes = {
  home: '/',
  login: '/login',
  dashboard: '/dashboard',
  requests: '/dashboard/requests',
  suppliers: '/dashboard/suppliers',
  auth: {
    login: '/auth/login',
    me: '/auth/me',
  },
  api: {
    adminRequests: '/admin/requests',
    adminSuppliers: '/admin/suppliers',
  },
  modules: [
    {
      slug: 'requests',
      label: 'Requests',
      description: 'Capture and review incoming request activity.',
    },
    {
      slug: 'suppliers',
      label: 'Suppliers',
      description: 'Track vendors, contacts, and qualification status.',
    },
    {
      slug: 'quotations',
      label: 'Quotations',
      description: 'Manage quote review, comparison, and approval.',
    },
    {
      slug: 'orders',
      label: 'Orders',
      description: 'Follow order progress through fulfillment.',
    },
    {
      slug: 'payments',
      label: 'Payments',
      description: 'Monitor payments and reconciliation tasks.',
    },
    {
      slug: 'deliveries',
      label: 'Deliveries',
      description: 'Track shipment handoff and delivery milestones.',
    },
    {
      slug: 'invoices',
      label: 'Invoices',
      description: 'Review invoice issuance and status.',
    },
  ],
} as const;

export const getModuleRoute = (slug: string) => `/dashboard/${slug}`;

export const getRequestRoute = (id: string) => `${routes.requests}/${id}`;

export const getSupplierRoute = (id: string) => `${routes.suppliers}/${id}`;

export const getModuleBySlug = (slug: string) =>
  routes.modules.find((module) => module.slug === slug);
