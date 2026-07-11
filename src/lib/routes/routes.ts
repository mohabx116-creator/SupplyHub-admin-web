export const routes = {
  home: '/',
  login: '/login',
  dashboard: '/dashboard',
  requests: '/dashboard/requests',
  suppliers: '/dashboard/suppliers',
  quotations: '/dashboard/quotations',
  orders: '/dashboard/orders',
  payments: '/dashboard/payments',
  auth: {
    login: '/auth/login',
    me: '/auth/me',
  },
  api: {
    adminRequests: '/admin/requests',
    adminSuppliers: '/admin/suppliers',
    adminSupplierQuotations: '/admin/supplier-quotations',
    adminOrders: '/admin/orders',
    adminPayments: '/admin/payments',
  },
  modules: [
    { slug: 'requests' },
    { slug: 'suppliers' },
    { slug: 'quotations' },
    { slug: 'orders' },
    { slug: 'payments' },
    { slug: 'deliveries' },
    { slug: 'invoices' },
  ],
} as const;

export const getModuleRoute = (slug: string) => `/dashboard/${slug}`;

export const getRequestRoute = (id: string) => `${routes.requests}/${id}`;

export const getSupplierRoute = (id: string) => `${routes.suppliers}/${id}`;

export const getQuotationRoute = (id: string) => `${routes.quotations}/${id}`;

export const getOrderRoute = (id: string) => `${routes.orders}/${id}`;

export const getPaymentRoute = (id: string) => `${routes.payments}/${id}`;

export const getModuleBySlug = (slug: string) =>
  routes.modules.find((module) => module.slug === slug);
