import type { Metadata } from 'next';
import '../styles/globals.css';
import Navbar from '@/components/layout/navbar/Navbar';
import { CartProvider } from '@/components/cart/cart-context';
import { getCart } from '@/lib/shopify';
import {
  ClerkProvider,
} from '@clerk/nextjs'

export const metadata: Metadata = {
  title: 'In Lieu Official',
  description: 'In Lieu Official - Sydney Based Clothing Brand',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Don't await the fetch, pass the Promise to the context provider
  const cart = getCart();

  return (
    <ClerkProvider>
    <html lang="en">
      <body className="font-sans antialiased">
        <CartProvider cartPromise={cart}>
            <Navbar />
            {children}
        </CartProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
