export const paymentStatuses = [
  'PENDING',
  'PARTIALLY_PAID',
  'PAID',
  'FAILED',
  'CANCELLED',
  'REFUNDED',
] as const;

export type PaymentStatus = (typeof paymentStatuses)[number];

export const paymentMethods = [
  'CASH',
  'BANK_TRANSFER',
  'CARD',
  'WALLET',
  'OTHER',
] as const;

export type PaymentMethod = (typeof paymentMethods)[number];

export type PaymentCompany = {
  id: string;
  name: string;
  status: string;
};

export type PaymentOrder = {
  id: string;
  orderNumber: string;
  requestId: string;
  customerQuotationId: string | null;
  status: string;
  currency: string;
  grandTotal: string;
  confirmedAt: string | null;
  cancelledAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PaymentRecord = {
  id: string;
  orderId: string;
  companyId: string;
  status: PaymentStatus;
  method: PaymentMethod;
  currency: string;
  amount: string;
  paidAmount: string;
  outstandingAmount: string;
  reference: string | null;
  paidAt: string | null;
  failedAt: string | null;
  cancelledAt: string | null;
  refundedAt: string | null;
  customerNotes: string | null;
  internalNotes: string | null;
  createdAt: string;
  updatedAt: string;
  order: PaymentOrder;
  company: PaymentCompany;
};

export type ListPaymentsParams = {
  status?: PaymentStatus;
  method?: PaymentMethod;
  companyId?: string;
  orderId?: string;
  reference?: string;
};
