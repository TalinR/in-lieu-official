import type { Metadata } from 'next';
import '../styles/globals.css';
import Navbar from '@/components/layout/navbar/Navbar';

export const metadata: Metadata = {
  title: 'In Lieu',
  description: 'Apparel & Accessories',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
