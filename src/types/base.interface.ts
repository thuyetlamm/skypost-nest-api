export type BaseQuery = {
  limit: number;
  page: number;
  keyword: string;
  status: number;
};

export type OptionsResponse<T> = {
  error?: boolean;
  message?: string;
  data?: T | null;
  status?: number;
};
