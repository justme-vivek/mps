import { useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '../services/api';

/**
 * Generic paginated list (lazy loading). Pages come from `?page=&limit=`
 * and the total from the `X-Total-Count` header, so the same hook serves
 * notices, events, downloads and media.
 *
 *   const list = useInfiniteList({ key: ['notices'], path: '/notices' });
 *   list.data          → flat array of everything loaded so far
 *   list.loadMore()    → safe to call on every scroll/end-reached event
 */
export function useInfiniteList({ key, path, params = {}, pageSize = 12, enabled = true }) {
  const query = useInfiniteQuery({
    queryKey: [...key, 'infinite', params],
    enabled,
    initialPageParam: 1,
    queryFn: async ({ pageParam, signal }) => {
      const res = await api.get(path, { params: { ...params, page: pageParam, limit: pageSize }, signal });
      const total = Number(res.headers?.['x-total-count']);
      return { items: res.data, page: pageParam, total: Number.isFinite(total) ? total : null, size: res.data.length };
    },
    getNextPageParam: (last, all) => {
      if (last.size < pageSize) return undefined; // short page = the end
      const loaded = all.reduce((n, p) => n + p.size, 0);
      if (last.total !== null && loaded >= last.total) return undefined;
      return last.page + 1;
    },
    select: (data) => data.pages.flatMap((p) => p.items),
  });

  const { hasNextPage, isFetchingNextPage, fetchNextPage } = query;
  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return { ...query, loadMore };
}
