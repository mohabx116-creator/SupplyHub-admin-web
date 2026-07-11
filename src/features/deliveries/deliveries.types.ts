export const deliveryStatuses = [
  'PENDING',
  'SCHEDULED',
  'IN_TRANSIT',
  'DELIVERED',
  'FAILED',
  'CANCELLED',
  'RETURNED',
] as const;

export type DeliveryStatus = (typeof deliveryStatuses)[number];

export const deliveryMethods = [
  'CUSTOMER_PICKUP',
  'SUPPLYHUB_DELIVERY',
  'THIRD_PARTY_COURIER',
  'SUPPLIER_DIRECT',
  'OTHER',
] as const;

export type DeliveryMethod = (typeof deliveryMethods)[number];

export type DeliveryCompany = {
  id: string;
  name: string;
  status: string;
};

export type DeliveryOrder = {
  id: string;
  orderNumber: string;
  status: string;
  currency: string;
  grandTotal: string;
  createdAt: string;
  updatedAt: string;
};

export type DeliveryRecord = {
  id: string;
  orderId: string;
  companyId: string;
  status: DeliveryStatus;
  method: DeliveryMethod;
  deliveryAddress: string | null;
  deliveryContactName: string | null;
  deliveryContactPhone: string | null;
  trackingReference: string | null;
  scheduledAt: string | null;
  dispatchedAt: string | null;
  deliveredAt: string | null;
  failedAt: string | null;
  cancelledAt: string | null;
  returnedAt: string | null;
  customerNotes: string | null;
  internalNotes: string | null;
  createdAt: string;
  updatedAt: string;
  order: DeliveryOrder;
  company: DeliveryCompany;
};

export type ListDeliveriesParams = {
  status?: DeliveryStatus;
  method?: DeliveryMethod;
  companyId?: string;
  orderId?: string;
  trackingReference?: string;
};
