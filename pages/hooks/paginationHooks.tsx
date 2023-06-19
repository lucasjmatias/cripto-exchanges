import { useState } from 'react';
import useSWR from 'swr';

interface ReqResponse<T> {
  data: T[];
  headers: Headers;
}

export function usePagination<T>(url: string, pageParameter: string) {
  const [page, setPage] = useState<number>(1);

  const { data, error, isLoading } = useSWR<ReqResponse<T>>(
    `${url}&${pageParameter}=${page}`
  );
  const perPage = Number(data?.headers?.get('per-page')) || 1;
  const total = Number(data?.headers?.get('total')) || 1;
  const lastPage = Math.ceil(total / perPage);

  return {
    page,
    setPage,
    total,
    lastPage,
    data: data?.data,
    error,
    isLoading,
  };
}
