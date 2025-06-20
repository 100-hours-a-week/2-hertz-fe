import { useQuery } from '@tanstack/react-query';
import { getTuningReports } from '@/lib/api/report';

export const useTuningReportsQuery = (page: number, sort: 'LATEST' | 'POPULAR') => {
  return useQuery({
    queryKey: ['tuningReports', page, sort],
    queryFn: () => getTuningReports(page, 10, sort),
  });
};
