export type ApiErrorDetails = Record<string, unknown> | string | null;

export class ApiError extends Error {
  status: number;
  code: string;
  details: ApiErrorDetails;

  constructor(
    message: string,
    options: {
      status?: number;
      code?: string;
      details?: ApiErrorDetails;
    } = {},
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = options.status ?? 0;
    this.code = options.code ?? 'API_ERROR';
    this.details = options.details ?? null;
  }
}
