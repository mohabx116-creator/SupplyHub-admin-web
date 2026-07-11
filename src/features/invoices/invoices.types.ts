export const invoiceStatuses = [
  'DRAFT',
  'ISSUED',
  'PARTIALLY_PAID',
  'PAID',
  'OVERDUE',
  'CANCELLED',
  'VOID',
  'REFUNDED',
] as const;

export type InvoiceStatus = (typeof invoiceStatuses)[number];

export const invoiceTypes = [
  'STANDARD',
  'PROFORMA',
  'CREDIT_NOTE',
  'DEBIT_NOTE',
] as const;

export type InvoiceType = (typeof invoiceTypes)[number];

export type InvoiceCompany = {
  id: string;
  name: string;
  status: string;
};

export type InvoiceOrder = {
  id: string;
  orderNumber: string;
  status: string;
  currency: string;
  grandTotal: string;
  createdAt: string;
  updatedAt: string;
};

export type InvoiceItem = {
  id: string;
  invoiceId: string;
  orderItemId: string | null;
  description: string;
  quantity: string;
  unitPrice: string;
  lineSubtotal: string;
  taxAmount: string;
  lineTotal: string;
  createdAt: string;
  updatedAt: string;
};

export type InvoiceRecord = {
  id: string;
  invoiceNumber: string;
  orderId: string;
  companyId: string;
  status: InvoiceStatus;
  type: InvoiceType;
  currency: string;
  itemsSubtotal: string;
  discountTotal: string;
  taxTotal: string;
  grandTotal: string;
  paidAmount: string;
  outstandingAmount: string;
  issuedAt: string | null;
  dueAt: string | null;
  paidAt: string | null;
  cancelledAt: string | null;
  voidedAt: string | null;
  refundedAt: string | null;
  customerNotes: string | null;
  internalNotes: string | null;
  createdAt: string;
  updatedAt: string;
  order: InvoiceOrder;
  company: InvoiceCompany;
  items: InvoiceItem[];
};

export type ListInvoicesParams = {
  status?: InvoiceStatus;
  type?: InvoiceType;
  companyId?: string;
  orderId?: string;
  invoiceNumber?: string;
};
