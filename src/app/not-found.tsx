import Image from 'next/image';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
      <Image 
        src="/images/logo/black_logo.svg" 
        alt="Logo" 
        width={120} 
        height={60}
        priority
      />
      <p className="text-lg text-gray-600">
        Sorry this page doesn&apos;t exist
      </p>
    </main>
  );
}
