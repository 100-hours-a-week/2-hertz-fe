import Image from 'next/image';

export default function ReportLoading() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8 py-10">
      <Image src="/images/report.png" alt="리포트 이미지" width={64} height={64} />
      <p className="text-sm">등록된 튜닝 리포트가 없어요</p>
    </div>
  );
}
