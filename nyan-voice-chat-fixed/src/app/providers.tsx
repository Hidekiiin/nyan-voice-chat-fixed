'use client';

import { ReactNode } from 'react';
import { configureAbly } from '@ably-labs/react-hooks';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const clientId = Math.random().toString(36).substring(2, 15);
  
  // Ablyの設定
  configureAbly({
    authUrl: '/api/ably',
    clientId: clientId
  });
  
  return (
    <>
      {children}
    </>
  );
}
