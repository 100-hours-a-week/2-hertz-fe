import { SyncLoader } from 'react-spinners';

export default function LoadingSpinner() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8 py-10">
      <SyncLoader color="var(--blue)" size={8} />
      <p className="text-sm">데이터를 불러오는 중이에요</p>
    </div>
  );
}
