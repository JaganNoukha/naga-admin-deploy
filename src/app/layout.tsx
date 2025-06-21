import './globals.css';

import GenericProvider from '@/providers/generic-provider';
import QueryProvider from '@/providers/query-provider';
import { ReduxProvider } from '@/providers/redux-provider';
import { Poppins } from 'next/font/google';

import type { Metadata } from 'next';
const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'SFA Admin - Login',
  description: 'Naga SFA Admin Panel',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <ReduxProvider>
          <QueryProvider>
            <GenericProvider>{children}</GenericProvider>
          </QueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
