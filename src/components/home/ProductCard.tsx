import Link from 'next/link';
import Image from 'next/image';

export default function ProductCard({
  title,
  href,
  src,
  alt
}: {
  title: string;
  href: string;
  src: string;
  alt: string;
}) {
  return (
    <Link href={href} className="block">
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100 rounded-3xl">
        <div className="absolute left-0 top-0 pl-6 pt-5 z-10 text-xl font-light text-black">
          {title}
        </div>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain"
          style={{ objectFit: 'contain' }}
          priority={false}
        />
      </div>
    </Link>
  );
}


