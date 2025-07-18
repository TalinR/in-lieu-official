import Link from 'next/link';
import Image from 'next/image';

const SocialSelection = () => {
  return (
    <div className="flex flex-col items-center space-y-4 lg:flex-row lg:justify-between lg:items-center lg:space-y-0">
      {/* Social Icons Section */}
      <div className="flex space-x-2">
        {/* Facebook Icon */}
        <a
          href="https://facebook.com/inlieu"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-opacity duration-200 hover:opacity-75"
          aria-label="Follow us on Facebook"
        >
          <Image
            src="/images/icons/facebook_icon.png"
            alt="Facebook"
            width={24}
            height={24}
            className="w-5 h-5"
          />
        </a>

        {/* TikTok Icon */}
        <a
          href="https://tiktok.com/@inlieu"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-opacity duration-200 hover:opacity-75"
          aria-label="Follow us on TikTok"
        >
          <Image
            src="/images/icons/tiktok_icon.svg"
            alt="TikTok"
            width={24}
            height={24}
            className="w-5 h-5"
          />
        </a>
      </div>

      {/* Brand Logo Section */}
      <Link
        href="/"
        className="transition-opacity duration-200 hover:opacity-75"
        aria-label="Go to homepage"
      >
        <Image
          src="/images/logo/black_logo.svg"
          alt="In Lieu"
          width={80}
          height={24}
          className="h-7 w-auto"
        />
      </Link>
    </div>
  );
};

export default SocialSelection;
