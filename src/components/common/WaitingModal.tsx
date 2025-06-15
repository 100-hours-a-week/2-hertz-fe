import { useWaitingModalStore } from '@/stores/modal/useWaitingModalStore';
import { FadeLoader } from 'react-spinners';

export default function WaitingModal() {
  const isOpen = useWaitingModalStore((state) => state.isOpen);
  const partnerNickname = useWaitingModalStore((state) => state.partnerNickname);

  return isOpen ? (
    <div className="pointer-events-none fixed inset-0 z-51 flex items-center justify-center bg-black/40">
      <div className="pointer-events-auto relative flex w-full max-w-xs flex-col items-center justify-center space-y-4 rounded-2xl bg-white p-6 text-center">
        <FadeLoader color="#84a7ff" height={10} width={3} margin={2} />
        <h2 className="text-base leading-relaxed font-semibold">
          {partnerNickname}님의 응답을
          <br />
          기다리고 있습니다
        </h2>
      </div>
    </div>
  ) : null;
}
