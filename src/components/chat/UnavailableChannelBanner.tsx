export default function UnavailableChannelBanner() {
  return (
    <div className="animate-fade-in absolute bottom-[55px] left-0 z-10 w-full max-w-[430px] bg-gradient-to-r from-[var(--blue)] to-[#a0c4ff] shadow-lg">
      <p className="p-4 text-center text-sm font-semibold text-white">
        매칭이 이루어지지 않아 채팅이 제한됩니다
      </p>
    </div>
  );
}
