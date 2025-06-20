'use client';

import { useState } from 'react';
import { ArrowUp } from 'lucide-react';
import toast from 'react-hot-toast';

const MAX_INPUT_LENGTH = 300;
interface ChatSignalInputBoxProps {
  onSend: (message: string, onSuccess: () => void) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function ChatSignalInputBox({
  onSend,
  placeholder = '메세지를 입력해주세요',
  disabled = false,
}: ChatSignalInputBoxProps) {
  const [value, setValue] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (isSending) return;

    const message = value.trim();
    if (!message) return;

    setIsSending(true);
    await onSend(message, () => setValue(''));
    setIsSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputText = e.target.value;
    if (inputText.length > MAX_INPUT_LENGTH) {
      toast.error('300자 이상은 입력할 수 없습니다.');
      return;
    }
    setValue(inputText);
  };

  return (
    <div className="flex w-full items-center justify-between rounded-full bg-[#f2f6fa] px-2 py-1.5">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="ml-2 flex-1 bg-transparent text-xs text-gray-500 outline-none placeholder:text-gray-400"
      />
      <button
        onClick={handleSend}
        className="ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow"
      >
        <ArrowUp className="h-3.5 w-3.5 text-gray-700" />
      </button>
    </div>
  );
}
