import type { H3Event } from 'h3';

export function useURLQueryBuilder(event: H3Event, parser?: (q: Record<string, any>) => Record<string, string>) {
  const raw = getQuery(event);
  const perPage = Number.parseInt(String(raw.per_page), 10) || 10;
  const currentPage = Number.parseInt(String(raw.page), 10) || 1;

  return {
    limit: perPage,
    offset: perPage * (currentPage - 1),
    search: String(raw.search ?? ''),
    ...parser?.(raw),
  };
}
