'use client';

import clsx from 'clsx';
import dayjs from 'dayjs';

interface SenderMessageProps {
  contents: string;
  sentAt: string;
  relationType: 'SIGNAL' | 'MATCHING' | 'UNMATCHED' | null;
}

export default function SenderMessage({ contents, sentAt, relationType }: SenderMessageProps) {
  return (
    <div className="flex items-end justify-end gap-2 pr-4 whitespace-pre-wrap">
      <p className="mt-1 text-xs text-[var(--gray-300)]">{dayjs(sentAt).format('HH:mm')}</p>
      <div className="max-w-[14rem]">
        <div
          className={clsx(
            'inline-block rounded-3xl border bg-white px-4 py-2 text-xs leading-[1.4] break-all text-black',
            relationType === 'MATCHING' ? 'border-[var(--pink)]' : 'border-[var(--blue)]',
          )}
        >
          {contents}
        </div>
      </div>
    </div>
  );
}
