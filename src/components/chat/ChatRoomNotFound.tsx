import Image from 'next/image';

export default function ChatRoomNotFoundPage() {
  return (
    <>
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 py-10 text-sm">
        <Image src="/images/matching.png" alt="프로필 이미지" width={80} height={100} />
        <p className="mt-8 text-[16px] font-semibold">당신의 첫 메시지를 기다리는 공간이에요</p>
        <p className="text-center font-medium text-[var(--gray-300)]">
          오늘 새로운 대화의 첫 페이지를 열어보세요 :)
        </p>
      </div>
    </>
  );
}
