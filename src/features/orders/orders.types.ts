export const orderStatuses = [
  'DRAFT',
  'CONFIRMED',
  'PROCUREMENT_IN_PROGRESS',
  'READY_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
] as const;

export type OrderStatus = (typeof orderStatuses)[number];

export type OrderCompany = {
  id: string;
  name: string;
  status: string;
};

export type OrderRequestCompany = {
  id: string;
  name: string;
  status: string;
};

export type OrderRequest = {
  id: string;
  title: string;
  status: string;
  company: OrderRequestCompany;
};

export type OrderCustomerQuotation = {
  id: string;
  requestId: string;
  status: string;
  currency: string;
  itemsSubtotal: string;
  shippingCost: string;
  serviceFee: string;
  taxAmount: string;
  discountAmount: string;
  grandTotal: string;
  validUntil: string | null;
  sentAt: string | null;
  approvedAt: string | null;
  rejectedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type OrderItem = {
  id: string;
  orderId: string;
  customerQuotationItemId: string | null;
  requestItemId: string | null;
  name: string;
  description: string | null;
  quantity: string;
  unit: string;
  unitPrice: string;
  lineTotal: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type OrderRecord = {
  id: string;
  orderNumber: string;
  requestId: string;
  customerQuotationId: string | null;
  companyId: string;
  status: OrderStatus;
  currency: string;
  itemsSubtotal: string;
  shippingCost: string;
  serviceFee: string;
  taxAmount: string;
  discountAmount: string;
  grandTotal: string;
  customerNotes: string | null;
  internalNotes: string | null;
  confirmedAt: string | null;
  cancelledAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
  updatedAt: string;
  company: OrderCompany;
  request: OrderRequest;
  customerQuotation: OrderCustomerQuotation;
  items: OrderItem[];
};

export type ListOrdersParams = {
  status?: OrderStatus;
  companyId?: string;
  requestId?: string;
  search?: string;
};
