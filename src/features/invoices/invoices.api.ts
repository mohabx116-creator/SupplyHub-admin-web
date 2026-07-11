import { request } from '@/lib/api/api-client';
import { routes } from '@/lib/routes/routes';
import type { InvoiceRecord, ListInvoicesParams } from './invoices.types';

const buildParams = (params?: ListInvoicesParams) => {
  if (!params) {
    return undefined;
  }

  return {
    ...(params.status ? { status: params.status } : {}),
    ...(params.type ? { type: params.type } : {}),
    ...(params.companyId ? { companyId: params.companyId } : {}),
    ...(params.orderId ? { orderId: params.orderId } : {}),
    ...(params.invoiceNumber ? { invoiceNumber: params.invoiceNumber } : {}),
  };
};

export const listInvoices = async (
  params?: ListInvoicesParams,
): Promise<InvoiceRecord[]> =>
  request<InvoiceRecord[]>({
    method: 'GET',
    url: routes.api.adminInvoices,
    params: buildParams(params),
  });

export const getInvoiceById = async (id: string): Promise<InvoiceRecord> =>
  request<InvoiceRecord>({
    method: 'GET',
    url: `${routes.api.adminInvoices}/${id}`,
  });
