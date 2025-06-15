'use client';

import Header from '@/components/layout/Header';
import { TbArrowsSort } from 'react-icons/tb';
import ReactionGroup from '@/components/report/ReactionGroup';
import { useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import { useTuningReportsQuery } from '@/hooks/useTuningReportsQuery';
import ReactMarkdown from 'react-markdown';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ReportLoading from '@/components/report/ReportLoading';
import remarkGfm from 'remark-gfm';

dayjs.extend(relativeTime);
dayjs.locale('ko');

export default function ReportPage() {
  const [sortType, setSortType] = useState<'LATEST' | 'POPULAR'>('LATEST');
  const [page, setPage] = useState(0);

  const { data, isLoading } = useTuningReportsQuery(page, sortType);

  const reports = data?.data?.list ?? [];

  const handleSortChange = () => {
    setSortType((prev) => (prev === 'LATEST' ? 'POPULAR' : 'LATEST'));
    setPage(0);
  };

  return (
    <div className="bg-white px-8 py-4">
      <Header title="튜닝 리포트" showBackButton={false} showNotificationButton={true} />

      <div className="mt-2 flex items-center justify-end">
        <div className="flex items-center gap-3 px-2">
          <button onClick={handleSortChange} className="flex items-center gap-1">
            {reports.length > 0 ? (
              <div className="flex items-center gap-1 whitespace-nowrap">
                <p className="text-sm font-medium">{sortType === 'LATEST' ? '최신순' : '인기순'}</p>
                <TbArrowsSort />
              </div>
            ) : (
              []
            )}
          </button>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : reports.length === 0 ? (
        <ReportLoading />
      ) : (
        reports.map((report) => (
          <div key={report.reportId}>
            <p className="px-2 font-bold">
              {reports.length > 0 && dayjs(report.createdDate).format('YYYY년 MM월 DD일')}
            </p>
            <div className="mt-4 mb-8 rounded-2xl border p-4">
              <p className="mb-4 text-sm font-bold">
                <mark className="bg-[var(--light-blue)]">{report.title}</mark>
              </p>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({ node, ...props }) => (
                    <h2 className="mt-4 mb-2 text-[0.85rem] font-bold text-gray-800" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="mt-3 text-[0.8rem] font-semibold text-gray-700" {...props} />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong className="text-[0.8rem] font-semibold text-black" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li
                      className="list-inside list-disc text-[0.8rem] leading-relaxed"
                      {...props}
                    />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      className="border-l-4 border-[var(--blue)] pl-4 text-[0.8rem] text-gray-600 italic"
                      {...props}
                    />
                  ),
                  p: ({ node, ...props }) => (
                    <p className="my-1 text-[0.8rem] leading-relaxed text-gray-800" {...props} />
                  ),
                }}
              >
                {report.content.replace(/\\n/g, '\n')}
              </ReactMarkdown>
              <ReactionGroup
                reportId={report.reportId}
                reactions={report.reactions}
                myReactions={report.myReactions}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
