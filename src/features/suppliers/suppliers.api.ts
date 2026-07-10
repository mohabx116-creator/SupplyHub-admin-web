import { request } from '@/lib/api/api-client';
import { routes } from '@/lib/routes/routes';
import type {
  ListSuppliersParams,
  SupplierRecord,
  SupplierStatusPayload,
  SupplierUpsertPayload,
} from './suppliers.types';

const buildParams = (params?: ListSuppliersParams) => {
  if (!params) {
    return undefined;
  }

  return {
    ...(params.status ? { status: params.status } : {}),
    ...(params.city ? { city: params.city } : {}),
    ...(params.category ? { category: params.category } : {}),
    ...(params.search ? { search: params.search } : {}),
  };
};

export const listSuppliers = async (
  params?: ListSuppliersParams,
): Promise<SupplierRecord[]> =>
  request<SupplierRecord[]>({
    method: 'GET',
    url: routes.api.adminSuppliers,
    params: buildParams(params),
  });

export const getSupplierById = async (id: string): Promise<SupplierRecord> =>
  request<SupplierRecord>({
    method: 'GET',
    url: `${routes.api.adminSuppliers}/${id}`,
  });

export const createSupplier = async (
  payload: SupplierUpsertPayload,
): Promise<SupplierRecord> =>
  request<SupplierRecord>({
    method: 'POST',
    url: routes.api.adminSuppliers,
    data: payload,
  });

export const updateSupplier = async (
  id: string,
  payload: SupplierUpsertPayload,
): Promise<SupplierRecord> =>
  request<SupplierRecord>({
    method: 'PATCH',
    url: `${routes.api.adminSuppliers}/${id}`,
    data: payload,
  });

export const updateSupplierStatus = async (
  id: string,
  payload: SupplierStatusPayload,
): Promise<SupplierRecord> =>
  request<SupplierRecord>({
    method: 'PATCH',
    url: `${routes.api.adminSuppliers}/${id}/status`,
    data: payload,
  });
