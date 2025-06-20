'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { MyReportReactions, ReportReactions } from '@/lib/api/report';
import { toggleTuningReportReaction } from '@/lib/api/report';
import toast from 'react-hot-toast';

const emojiToApiType = {
  '👍🏻': 'THUMBS_UP',
  '🤣': 'LAUGH',
  '👀': 'EYES',
  '💗': 'HEART',
  '🎉': 'CELEBRATE',
} as const;

type Emoji = keyof typeof emojiToApiType;

interface ReactionGroupProps {
  reportId: number;
  reactions: ReportReactions;
  myReactions: MyReportReactions;
}

export default function ReactionGroup({ reportId, reactions, myReactions }: ReactionGroupProps) {
  const [localReactions, setLocalReactions] = useState(reactions);
  const [localMyReactions, setLocalMyReactions] = useState(myReactions);

  useEffect(() => {
    const toApiKey = (key: string) => {
      switch (key) {
        case 'celebrate':
          return 'CELEBRATE';
        case 'thumbsUp':
          return 'THUMBS_UP';
        case 'laugh':
          return 'LAUGH';
        case 'eyes':
          return 'EYES';
        case 'heart':
          return 'HEART';
        default:
          return key;
      }
    };

    const transformedMyReactions = Object.fromEntries(
      Object.entries(myReactions).map(([k, v]) => [toApiKey(k), v]),
    );

    const transformedReactions = Object.fromEntries(
      Object.entries(reactions).map(([k, v]) => [toApiKey(k), v]),
    );

    setLocalMyReactions(transformedMyReactions as MyReportReactions);
    setLocalReactions(transformedReactions as ReportReactions);
  }, [reactions, myReactions]);

  const handleToggle = async (emoji: Emoji) => {
    const type = emojiToApiType[emoji];
    const isCurrentlyReacted = localMyReactions[type];

    // optimistic UI update
    setLocalMyReactions((prev) => ({
      ...prev,
      [type]: !isCurrentlyReacted,
    }));

    setLocalReactions((prev) => ({
      ...prev,
      [type]: (prev[type] ?? 0) + (isCurrentlyReacted ? -1 : 1),
    }));

    try {
      const res = await toggleTuningReportReaction(reportId, type);
      const { data, code } = res;

      if (!data) {
        if (code === 'DELETED_REPORT') {
          toast.error('이미 삭제된 리포트입니다.');
        }

        // optimistic UI rollback
        setLocalMyReactions((prev) => ({
          ...prev,
          [type]: isCurrentlyReacted,
        }));

        setLocalReactions((prev) => ({
          ...prev,
          [type]: (prev[type] ?? 0) + (isCurrentlyReacted ? 1 : -1),
        }));

        return;
      }

      // 실제 response 값으로 동기화
      setLocalMyReactions((prev) => ({
        ...prev,
        [type]: data.isReacted,
      }));

      setLocalReactions((prev) => ({
        ...prev,
        [type]: data.reactionCount,
      }));
    } catch (err) {
      console.error(err);
      toast.error('리액션 처리 중 오류가 발생했습니다.');

      // error 발생 시 rollback
      setLocalMyReactions((prev) => ({
        ...prev,
        [type]: isCurrentlyReacted,
      }));

      setLocalReactions((prev) => ({
        ...prev,
        [type]: (prev[type] ?? 0) + (isCurrentlyReacted ? 1 : -1),
      }));
    }
  };

  return (
    <div className="mt-4 flex w-full flex-wrap justify-center gap-2">
      {Object.entries(emojiToApiType).map(([emoji, type]) => {
        const isSelected = localMyReactions[type];
        const count = localReactions[type] ?? 0;

        return (
          <button
            key={emoji}
            onClick={() => handleToggle(emoji as Emoji)}
            className={clsx(
              'flex items-center justify-around gap-1 rounded-3xl border px-3 py-1.5 text-xs font-semibold transition-all duration-200',
              isSelected
                ? 'border-[var(--dark-blue)] bg-[var(--light-blue)] text-[var(--dark-blue)]'
                : 'border-[var(--gray-100)] bg-white text-[var(--gray-400)]',
            )}
          >
            <span className="text-[12px]">{emoji}</span>
            <span className="text-[0.7rem]">{count}</span>
          </button>
        );
      })}
    </div>
  );
}
