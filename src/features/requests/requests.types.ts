export const requestStatuses = [
  'NEW',
  'NEEDS_REVIEW',
  'NEEDS_CLARIFICATION',
  'READY_FOR_SOURCING',
  'SOURCING',
  'SUPPLIER_QUOTES_RECEIVED',
  'CUSTOMER_QUOTE_SENT',
  'CUSTOMER_APPROVED',
  'CUSTOMER_REJECTED',
  'CANCELLED',
  'CONVERTED_TO_ORDER',
] as const;

export type RequestStatus = (typeof requestStatuses)[number];

export type RequestCompany = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  status: string;
};

export type RequestRequestedBy = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  companyId: string | null;
};

export type RequestItem = {
  id: string;
  requestId: string;
  name: string;
  description: string | null;
  quantity: string;
  unit: string;
  specifications: string | null;
  preferredBrand: string | null;
  estimatedBudget: string | null;
  createdAt: string;
  updatedAt: string;
};

export type RequestRecord = {
  id: string;
  companyId: string;
  requestedByUserId: string;
  title: string;
  description: string | null;
  status: RequestStatus;
  neededByDate: string | null;
  deliveryCity: string | null;
  deliveryAddress: string | null;
  customerNotes: string | null;
  internalNotes: string | null;
  createdAt: string;
  updatedAt: string;
  company: RequestCompany;
  requestedBy: RequestRequestedBy;
  items: RequestItem[];
};

export type ListRequestsParams = {
  status?: RequestStatus;
  companyId?: string;
};
