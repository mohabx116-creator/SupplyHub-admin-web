export const supplierStatuses = ['ACTIVE', 'INACTIVE', 'BLACKLISTED'] as const;

export type SupplierStatus = (typeof supplierStatuses)[number];

export type SupplierContact = {
  id: string;
  supplierId: string;
  name: string;
  role: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SupplierRecord = {
  id: string;
  name: string;
  legalName: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  city: string | null;
  address: string | null;
  taxNumber: string | null;
  status: SupplierStatus;
  category: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  contacts: SupplierContact[];
};

export type ListSuppliersParams = {
  status?: SupplierStatus;
  city?: string;
  category?: string;
  search?: string;
};

export type SupplierContactPayload = {
  name: string;
  role?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  isPrimary?: boolean;
};

export type SupplierUpsertPayload = {
  name: string;
  legalName?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  city?: string;
  address?: string;
  taxNumber?: string;
  category?: string;
  notes?: string;
  status?: SupplierStatus;
  contacts?: SupplierContactPayload[];
};

export type SupplierStatusPayload = {
  status: SupplierStatus;
};
