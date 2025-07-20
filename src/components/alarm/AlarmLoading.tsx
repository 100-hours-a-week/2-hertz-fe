import Image from 'next/image';

export default function AlarmLoading() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 py-10">
      <Image src="/images/talking.png" alt="리포트 이미지" width={64} height={64} />
      <p className="mt-8 text-sm">등록된 알림이 없어요</p>
      <p className="text-center text-sm text-[var(--gray-400)]">
        지금은 조용하지만 <br /> 대화를 시작하면 알림이 생겨요 :)
      </p>
    </div>
  );
}
