export const quotationStatuses = [
  'DRAFT',
  'RECEIVED',
  'SELECTED',
  'REJECTED',
  'EXPIRED',
  'CANCELLED',
] as const;

export type QuotationStatus = (typeof quotationStatuses)[number];

export type QuotationSupplier = {
  id: string;
  name: string;
  legalName: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  city: string | null;
  address: string | null;
  taxNumber: string | null;
  status: string;
  category: string | null;
  createdAt: string;
  updatedAt: string;
};

export type QuotationRequestCompany = {
  id: string;
  name: string;
  status: string;
};

export type QuotationRequest = {
  id: string;
  title: string;
  status: string;
  company: QuotationRequestCompany;
};

export type QuotationItem = {
  id: string;
  supplierQuotationId: string;
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

export type QuotationRecord = {
  id: string;
  requestId: string;
  supplierId: string;
  status: QuotationStatus;
  currency: string;
  subtotal: string;
  shippingCost: string;
  taxAmount: string;
  discountAmount: string;
  grandTotal: string;
  validUntil: string | null;
  leadTimeDays: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  supplier: QuotationSupplier;
  request: QuotationRequest;
  items: QuotationItem[];
};

export type ListQuotationsParams = {
  status?: QuotationStatus;
  supplierId?: string;
};
