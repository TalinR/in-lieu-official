import Link from 'next/link';

interface Page {
  name: string;
  description: string;
  href: string;
}

interface PageLinksProps {
  pages: Page[];
  currentPath: string;
  onLinkClick?: () => void;
}

const PageLinks = ({ pages, currentPath, onLinkClick }: PageLinksProps) => {
  return (
    <div className="space-y-6">
      {pages.map((page) => {
        const isActive = currentPath === page.href;
        
        return (
          <Link
            key={page.href}
            href={page.href}
            onClick={onLinkClick}
            className={`block transition-opacity duration-200 ${
              !isActive ? 'hover:opacity-75' : ''
            }`}
          >
            <div className="text-center lg:text-left">
              <h3
                className={`text-sm font-regular transition-colors duration-200 ${
                  isActive 
                    ? 'text-[#635BFF]' 
                    : 'text-gray-800 font-light'
                }`}
              >
                {page.name}
              </h3>
              <p
                className={`text-sm transition-colors duration-200 ${
                  isActive 
                    ? 'text-black' 
                    : 'text-[#5A5A5A]'
                }`}
              >
                {page.description}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default PageLinks;
