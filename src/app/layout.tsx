import type { Metadata } from 'next';
import '../styles/globals.css';
import Navbar from '@/components/layout/navbar/Navbar';
import { SectionsProvider } from '@/components/layout/SectionsContext';
import { CartProvider } from '@/components/cart/cart-context';
import { getCart } from '@/lib/shopify';

export const metadata: Metadata = {
  title: 'In Lieu',
  description: 'Apparel & Accessories',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Don't await the fetch, pass the Promise to the context provider
  const cart = getCart();

  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <CartProvider cartPromise={cart}>
          <SectionsProvider>
            <Navbar />
            {children}
          </SectionsProvider>
        </CartProvider>
      </body>
    </html>
  );
}
