import Image from 'next/image';

export default function AlarmListNotFoundPage() {
  return (
    <>
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 py-10 text-sm">
        <Image src="/images/matching.png" alt="프로필 이미지" width={80} height={100} />
        <p className="mt-8 text-[16px] font-semibold">당신의 첫 알림을 기다리는 공간이에요</p>
        <p className="text-center font-medium text-[var(--gray-300)]">
          서비스를 이용하며 알림을 받아보세요!
        </p>
      </div>
    </>
  );
}
