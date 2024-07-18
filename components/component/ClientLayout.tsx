"use client";

import { usePathname } from 'next/navigation';
import { Header } from "@/components/component/header";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <>
      {!isLoginPage && <Header />}
      {children}
    </>
  );
}