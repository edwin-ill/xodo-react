import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "./Provider";
import { ThemeProvider } from "next-themes";
import { ClientLayout } from "@/components/ClientLayout";
import SessionWrapper from "@/components/SessionWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Xodo Auto Import",
  description: "El mejor dealer del país",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionWrapper>
          <ThemeProvider defaultTheme="light" attribute="class">
            <Provider>
              <ClientLayout>
                {children}
              </ClientLayout>
            </Provider>
          </ThemeProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}