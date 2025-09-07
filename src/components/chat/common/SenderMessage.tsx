'use client';

import clsx from 'clsx';
import dayjs from 'dayjs';
import { memo, useMemo } from 'react';

interface SenderMessageProps {
  contents: string;
  sentAt: string;
  relationType: 'SIGNAL' | 'MATCHING' | 'UNMATCHED' | null;
}

const SenderMessage = memo(function SenderMessage({
  contents,
  sentAt,
  relationType,
}: SenderMessageProps) {
  const formattedTime = useMemo(() => dayjs(sentAt).format('HH:mm'), [sentAt]);

  const messageBorderClass = clsx(
    'inline-block rounded-3xl border bg-white px-4 py-2 text-xs leading-[1.4] break-all text-black',
    relationType === 'MATCHING' ? 'border-[var(--pink)]' : 'border-[var(--blue)]',
  );

  return (
    <div className="flex items-end justify-end gap-2 pr-4 whitespace-pre-wrap">
      <p className="mt-1 text-xs text-[var(--gray-300)]">{formattedTime}</p>
      <div className="max-w-[14rem]">
        <div className={messageBorderClass}>{contents}</div>
      </div>
    </div>
  );
});

export default SenderMessage;
