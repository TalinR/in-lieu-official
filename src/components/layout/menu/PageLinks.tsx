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
    <div className="space-y-4 lg:space-y-8">
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
            <div className="text-center landscape:text-left">
              <h3
                className={`text-sm font-regular transition-colors duration-200 lg:text-lg ${
                  isActive 
                    ? 'text-[#635BFF]' 
                    : 'text-gray-800 font-light'
                }`}
              >
                {page.name}
              </h3>
              <p
                className={`text-sm font-light transition-colors duration-200 lg:text-lg ${
                  isActive 
                    ? 'text-black font-regular' 
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
