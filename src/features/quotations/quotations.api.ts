import { request } from '@/lib/api/api-client';
import { routes } from '@/lib/routes/routes';
import type {
  ListQuotationsParams,
  QuotationRecord,
} from './quotations.types';

const buildParams = (params?: ListQuotationsParams) => {
  if (!params) {
    return undefined;
  }

  return {
    ...(params.status ? { status: params.status } : {}),
    ...(params.supplierId ? { supplierId: params.supplierId } : {}),
  };
};

export const listSupplierQuotations = async (
  requestId: string,
  params?: ListQuotationsParams,
): Promise<QuotationRecord[]> =>
  request<QuotationRecord[]>({
    method: 'GET',
    url: `${routes.api.adminRequests}/${requestId}/supplier-quotations`,
    params: buildParams(params),
  });

export const getSupplierQuotationById = async (
  id: string,
): Promise<QuotationRecord> =>
  request<QuotationRecord>({
    method: 'GET',
    url: `${routes.api.adminSupplierQuotations}/${id}`,
  });
