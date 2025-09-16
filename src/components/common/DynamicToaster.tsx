'use client';

import dynamic from 'next/dynamic';

const ToasterComponent = dynamic(
  () => import('react-hot-toast').then((mod) => ({ default: mod.Toaster })),
  {
    ssr: false,
  },
);

export default function DynamicToaster() {
  return <ToasterComponent />;
}
